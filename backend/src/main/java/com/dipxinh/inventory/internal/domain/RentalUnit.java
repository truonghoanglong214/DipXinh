package com.dipxinh.inventory.internal.domain;

import java.time.Instant;
import java.util.UUID;

public record RentalUnit(
    UUID id,
    UUID shopId,
    UUID variantId,
    String qrToken,
    String unitCode,
    PhysicalCondition physicalCondition,
    String currentMeasurements,
    Instant actualReadyAt,
    boolean isRetired,
    long version
) {
}
