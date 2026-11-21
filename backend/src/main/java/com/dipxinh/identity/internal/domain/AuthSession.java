package com.dipxinh.identity.internal.domain;

import java.time.Instant;
import java.util.UUID;

public record AuthSession(
    UUID id,
    UUID userId,
    String clientLabel,
    Instant createdAt,
    Instant lastUsedAt,
    Instant absoluteExpiresAt,
    Instant revokedAt,
    String revocationReason
) {

    public boolean isActive(Instant now) {
        return revokedAt == null && now.isBefore(absoluteExpiresAt);
    }
}
