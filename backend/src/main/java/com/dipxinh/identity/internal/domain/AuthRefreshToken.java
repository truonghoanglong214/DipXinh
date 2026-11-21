package com.dipxinh.identity.internal.domain;

import java.time.Instant;
import java.util.UUID;

public record AuthRefreshToken(
    UUID id,
    UUID sessionId,
    String tokenHash,
    UUID parentTokenId,
    Instant createdAt,
    Instant expiresAt,
    Instant usedAt,
    Instant revokedAt,
    Instant reuseDetectedAt
) {
    public boolean isActive(Instant now) {
        return usedAt == null && revokedAt == null && now.isBefore(expiresAt);
    }
}
