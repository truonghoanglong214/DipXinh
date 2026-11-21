package com.dipxinh.identity.internal.web.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProductResponse(
    UUID id,
    UUID shopId,
    UUID categoryId,
    String sku,
    String title,
    String description,
    boolean supportsRental,
    boolean supportsSale,
    boolean isPublished,
    Instant createdAt,
    List<VariantResponse> variants
) {
    public record VariantResponse(
        UUID id,
        String variantSku,
        String sizeLabel,
        String colorLabel,
        String garmentMeasurements
    ) {}
}
