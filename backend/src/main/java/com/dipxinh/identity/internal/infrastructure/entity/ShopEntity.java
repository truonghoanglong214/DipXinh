package com.dipxinh.identity.internal.infrastructure.entity;

import com.dipxinh.identity.internal.domain.ShopStatus;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "shops")
public class ShopEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "slug", nullable = false, unique = true, length = 90)
    private String slug;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 24)
    private ShopStatus status;

    @Column(name = "owner_user_id", nullable = false)
    private UUID ownerUserId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected ShopEntity() {}

    public ShopEntity(String slug, String name, UUID ownerUserId) {
        this.slug = slug;
        this.name = name;
        this.ownerUserId = ownerUserId;
        this.status = ShopStatus.ACTIVE;
        this.createdAt = Instant.now();
    }

    public void update(String name, ShopStatus status)
    {
        this.name = name;
        this.status = status;
    }

    public UUID getId() { return id; }
    public String getSlug() { return slug; }
    public String getName() { return name; }
    public ShopStatus getStatus() { return status; }
    public UUID getOwnerUserId() { return ownerUserId; }
    public Instant getCreatedAt() { return createdAt; }
}
