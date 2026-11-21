package com.dipxinh.identity.internal.infrastructure.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "auth_sessions")
public class AuthSessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "client_label", length = 120)
    private String clientLabel;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "last_used_at", nullable = false)
    private Instant lastUsedAt;

    @Column(name = "absolute_expires_at", nullable = false)
    private Instant absoluteExpiresAt;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @Column(name = "revocation_reason", length = 60)
    private String revocationReason;

    protected AuthSessionEntity() {}

    public AuthSessionEntity(
        UUID userId,
        String clientLabel,
        Instant createdAt,
        Instant lastUsedAt,
        Instant absoluteExpiresAt
        )
    {
        this.userId = Objects.requireNonNull(userId,"User id cannot be null.");
        this.clientLabel = clientLabel;
        this.createdAt = Objects.requireNonNull(createdAt,"Created at cannot be null.");
        this.lastUsedAt = Objects.requireNonNull(
            lastUsedAt,
            "Last used at cannot be null.");
        this.absoluteExpiresAt = Objects.requireNonNull(absoluteExpiresAt,"Absolute expires at cannot be null.");
        if(!absoluteExpiresAt.isAfter(createdAt))
        {
            throw new IllegalStateException("Absolute expires must be after created at.");
        }
    }

    public UUID getId() {
        return id;
    }

    public UUID getUserId()
    {
        return userId;
    }

    public String getClientLabel()
    {
        return clientLabel;
    }

    public Instant getCreatedAt()
    {
        return createdAt;
    }

    public Instant getLastUsedAt()
    {
        return lastUsedAt;
    }

    public Instant getAbsoluteExpiresAt()
    {
        return absoluteExpiresAt;
    }

    public Instant getRevokedAt()
    {
        return revokedAt;
    }

    public String getRevocationReason()
    {
        return revocationReason;
    }

    public void updateState(
        Instant lastUsedAt,
        Instant revokedAt,
        String revocationReason
    ) {
        if(lastUsedAt == null)
            throw new IllegalArgumentException("Last used at cannot be null.");

        if(revokedAt != null && (revocationReason == null || revocationReason.isBlank()))
        {
            throw new IllegalArgumentException("Revocation reason is required.");
        }

        if (revokedAt == null && revocationReason != null) {
            throw new IllegalArgumentException(
                "Revocation reason requires revokedAt."
            );
        }

        if (this.revokedAt != null && revokedAt == null) {
            throw new IllegalArgumentException(
                "Cannot reactivate a revoked session."
            );
        }

        this.lastUsedAt = lastUsedAt;
        this.revokedAt = revokedAt;
        this.revocationReason = revocationReason;
    }

}
