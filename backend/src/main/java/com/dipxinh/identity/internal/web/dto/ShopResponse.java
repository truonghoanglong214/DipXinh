package com.dipxinh.identity.internal.web.dto;

import com.dipxinh.identity.internal.domain.ShopStatus;

import java.time.Instant;
import java.util.UUID;

public record ShopResponse(
    UUID id,
    String slug,
    String name,
    ShopStatus status,
    UUID ownerUserId,
    Instant createdAt
) {
}
