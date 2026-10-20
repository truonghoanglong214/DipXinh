
package com.dipxinh;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
class FlywayMigrationTest {

    @Container
    static PostgreSQLContainer postgres =
        new PostgreSQLContainer("postgres:17")
            .withDatabaseName("dipxinh_flyway_test")
            .withUsername("test_user")
            .withPassword("test_password");

    @Test
    void shouldMigrateFromEmptyDatabaseAndValidate() throws SQLException {

        String jdbcUrl = postgres.getJdbcUrl();
        String username = postgres.getUsername();
        String password = postgres.getPassword();

        // 1. Database mới phải chưa có bảng nghiệp vụ
        try (Connection connection =
                 DriverManager.getConnection(jdbcUrl, username, password)) {

            assertEquals(0, count(connection, """
                    SELECT COUNT(*)
                    FROM information_schema.tables
                    WHERE table_schema = 'public'
                      AND table_type = 'BASE TABLE'
                    """));
        }

        // 2. Flyway dùng trực tiếp database của Testcontainers
        Flyway flyway = Flyway.configure()
            .dataSource(jdbcUrl, username, password)
            .locations("classpath:db/migration")
            .cleanDisabled(true)
            .validateOnMigrate(true)
            .load();

        // 3. Áp dụng lần đầu: V1 đến V9
        var firstMigration = flyway.migrate();

        assertEquals(9, firstMigration.migrationsExecuted,
            "Expected 9 migrations on an empty database");

        // 4. Kiểm tra schema thật trong PostgreSQL
        try (Connection connection =
                 DriverManager.getConnection(jdbcUrl, username, password)) {

            assertEquals(9, count(connection, """
                    SELECT COUNT(*)
                    FROM flyway_schema_history
                    WHERE success = TRUE
                    """));

            assertTrue(exists(connection,
                "SELECT to_regclass('public.app_users') IS NOT NULL"));

            assertTrue(exists(connection,
                "SELECT to_regclass('public.shops') IS NOT NULL"));

            assertTrue(exists(connection,
                "SELECT to_regclass('public.rental_allocations') IS NOT NULL"));

            assertTrue(exists(connection,
                "SELECT to_regclass('public.payment_transactions') IS NOT NULL"));

            assertTrue(exists(connection,
                "SELECT to_regclass('public.notifications') IS NOT NULL"));

            assertTrue(exists(connection,
                "SELECT to_regclass('public.outbox_events') IS NOT NULL"));

            // Extension chống overlap của PostgreSQL
            assertTrue(exists(connection, """
                    SELECT EXISTS (
                        SELECT 1
                        FROM pg_extension
                        WHERE extname = 'btree_gist'
                    )
                    """));

            // Exclusion constraint ngăn giữ trùng QR
            assertTrue(exists(connection, """
                    SELECT EXISTS (
                        SELECT 1
                        FROM pg_constraint
                        WHERE conname = 'no_same_unit_overlapping_active_bookings'
                          AND contype = 'x'
                    )
                    """));
        }

        // 5. Flyway validation sau lần migration đầu
        flyway.validate();

        // 6. Chạy lần hai không được apply thêm migration
        var secondMigration = flyway.migrate();

        assertEquals(0, secondMigration.migrationsExecuted,
            "Second migration run must not reapply existing versions");

        flyway.validate();
    }

    private static int count(Connection connection, String sql)
        throws SQLException {

        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {

            resultSet.next();
            return resultSet.getInt(1);
        }
    }

    private static boolean exists(Connection connection, String sql)
        throws SQLException {

        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {

            resultSet.next();
            return resultSet.getBoolean(1);
        }
    }
}
