package com.dipxinh.catalog.internal.domain;

import java.util.UUID;

public record Category(
    UUID id,
    UUID shopId,
    UUID parentId,
    String name
) {
}
