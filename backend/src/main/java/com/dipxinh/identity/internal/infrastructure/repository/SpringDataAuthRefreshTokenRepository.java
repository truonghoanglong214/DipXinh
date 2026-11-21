package com.dipxinh.identity.internal.infrastructure.repository;

import com.dipxinh.identity.internal.infrastructure.entity.AuthRefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataAuthRefreshTokenRepository extends JpaRepository<AuthRefreshTokenEntity, UUID> {

    Optional<AuthRefreshTokenEntity> findByTokenHash(String tokenHash);

    @Modifying
    @Query("UPDATE AuthRefreshTokenEntity r SET r.revokedAt = :revokedAt WHERE r.sessionId = :sessionId AND r.revokedAt IS NULL")
    void revokeAllBySessionId(@Param("sessionId") UUID sessionId, @Param("revokedAt") Instant revokedAt);
}
