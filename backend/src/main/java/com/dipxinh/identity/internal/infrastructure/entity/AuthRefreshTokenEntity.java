package com.dipxinh.identity.internal.infrastructure.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;

import java.sql.Types;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "auth_refresh_tokens")
public class AuthRefreshTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "session_id", nullable = false)
    private UUID sessionId;

    @JdbcTypeCode(Types.CHAR)
    @Column(name = "token_hash", nullable = false, length = 64, unique = true, columnDefinition = "char(64)")
    private String tokenHash;

    @Column(name = "parent_token_id")
    private UUID parentTokenId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "used_at")
    private Instant usedAt;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @Column(name = "reuse_detected_at")
    private Instant reuseDetectedAt;

    protected AuthRefreshTokenEntity() {
    }

    public AuthRefreshTokenEntity(
        UUID sessionId,
        String tokenHash,
        UUID parentTokenId,
        Instant createdAt,
        Instant expiresAt
    ) {
        this.sessionId = Objects.requireNonNull(sessionId, "Session ID cannot be null");
        this.tokenHash = Objects.requireNonNull(tokenHash, "Token hash cannot be null");
        this.parentTokenId = parentTokenId;
        this.createdAt = Objects.requireNonNull(createdAt, "Created at cannot be null");
        this.expiresAt = Objects.requireNonNull(expiresAt, "Expires at cannot be null");
    }

    public UUID getId() {
        return id;
    }

    public UUID getSessionId() {
        return sessionId;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public UUID getParentTokenId() {
        return parentTokenId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public Instant getUsedAt() {
        return usedAt;
    }

    public Instant getRevokedAt() {
        return revokedAt;
    }

    public Instant getReuseDetectedAt() {
        return reuseDetectedAt;
    }

    public void markAsUsed(Instant now) {
        this.usedAt = now;
    }

    public void markAsRevoked(Instant now) {
        this.revokedAt = now;
    }

    public void markAsReuseDetected(Instant now) {
        this.reuseDetectedAt = now;
        this.revokedAt = now;
    }
}
