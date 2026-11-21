package com.dipxinh.inventory.internal.infrastructure.entity;

import com.dipxinh.inventory.internal.domain.PhysicalCondition;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "rental_units",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_rental_units_shop_id", columnNames = {"shop_id", "id"}),
        @UniqueConstraint(name = "uk_rental_units_shop_code", columnNames = {"shop_id", "unit_code"}),
        @UniqueConstraint(name = "uk_rental_units_qr_token", columnNames = {"qr_token"})
    }
)
public class RentalUnitEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "shop_id", nullable = false)
    private UUID shopId;

    @Column(name = "variant_id", nullable = false)
    private UUID variantId;

    @Column(name = "qr_token", nullable = false, unique = true, length = 120)
    private String qrToken;

    @Column(name = "unit_code", nullable = false, length = 90)
    private String unitCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "physical_condition", nullable = false, length = 32)
    private PhysicalCondition physicalCondition = PhysicalCondition.READY;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "current_measurements", nullable = false, columnDefinition = "jsonb")
    private String currentMeasurements = "{}";

    @Column(name = "actual_ready_at")
    private Instant actualReadyAt;

    @Column(name = "is_retired", nullable = false)
    private boolean isRetired = false;

    @Version
    @Column(name = "version", nullable = false)
    private long version = 0L;

    protected RentalUnitEntity() {}

    public RentalUnitEntity(
        UUID shopId,
        UUID variantId,
        String qrToken,
        String unitCode,
        PhysicalCondition physicalCondition,
        String currentMeasurements,
        Instant actualReadyAt
    ) {
        this.shopId = shopId;
        this.variantId = variantId;
        this.qrToken = qrToken;
        this.unitCode = unitCode;
        this.physicalCondition = physicalCondition != null ? physicalCondition : PhysicalCondition.READY;
        this.currentMeasurements = currentMeasurements != null ? currentMeasurements : "{}";
        this.actualReadyAt = actualReadyAt;
        this.isRetired = false;
        this.version = 0L;
    }

    public void updateCondition(PhysicalCondition condition, Instant actualReadyAt) {
        this.physicalCondition = condition;
        this.actualReadyAt = actualReadyAt;
    }

    public void updateMeasurements(String measurements) {
        if (measurements != null) {
            this.currentMeasurements = measurements;
        }
    }

    public void retire() {
        this.isRetired = true;
        this.physicalCondition = PhysicalCondition.OUT_OF_SERVICE;
    }

    public UUID getId() { return id; }
    public UUID getShopId() { return shopId; }
    public UUID getVariantId() { return variantId; }
    public String getQrToken() { return qrToken; }
    public String getUnitCode() { return unitCode; }
    public PhysicalCondition getPhysicalCondition() { return physicalCondition; }
    public String getCurrentMeasurements() { return currentMeasurements; }
    public Instant getActualReadyAt() { return actualReadyAt; }
    public boolean isRetired() { return isRetired; }
    public long getVersion() { return version; }
}
