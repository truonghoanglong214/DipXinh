package com.dipxinh.identity.internal.domain;

import java.time.Instant;
import java.util.UUID;

public record Shop(
    UUID id,
    String slug,
    String name,
    ShopStatus status,
    UUID ownerUserId,
    Instant createdAt
) {
    public boolean isActive()
    {
        return status == ShopStatus.ACTIVE;
    }

}
