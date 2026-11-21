package com.dipxinh.catalog.internal.domain;

import java.util.UUID;

public record ProductVariant(
    UUID id,
    UUID shopId,
    UUID productId,
    String variantSku,
    String sizeLabel,
    String colorLabel,
    String garmentMeasurements
) {
}
