package com.dipxinh.catalog.internal.domain;

import java.time.Instant;
import java.util.UUID;

public record Product(
    UUID id,
    UUID shopId,
    UUID categoryId,
    String sku,
    String title,
    String description,
    boolean supportsRental,
    boolean supportsSale,
    boolean isPublished,
    Instant createdAt
) {
}
