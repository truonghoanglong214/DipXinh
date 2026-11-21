package com.dipxinh.catalog.internal.infrastructure.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "products",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_products_shop_id", columnNames = {"shop_id", "id"}),
        @UniqueConstraint(name = "uk_products_shop_sku", columnNames = {"shop_id", "sku"})
    }
)
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "shop_id", nullable = false)
    private UUID shopId;

    @Column(name = "category_id")
    private UUID categoryId;

    @Column(name = "sku", nullable = false, length = 80)
    private String sku;

    @Column(name = "title", nullable = false, length = 220)
    private String title;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "supports_rental", nullable = false)
    private boolean supportsRental = true;

    @Column(name = "supports_sale", nullable = false)
    private boolean supportsSale = false;

    @Column(name = "is_published", nullable = false)
    private boolean isPublished = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected ProductEntity() {}

    public ProductEntity(
        UUID shopId,
        UUID categoryId,
        String sku,
        String title,
        String description,
        boolean supportsRental,
        boolean supportsSale,
        boolean isPublished
    ) {
        this.shopId = shopId;
        this.categoryId = categoryId;
        this.sku = sku;
        this.title = title;
        this.description = description;
        this.supportsRental = supportsRental;
        this.supportsSale = supportsSale;
        this.isPublished = isPublished;
        this.createdAt = Instant.now();
    }

    public void update(
        UUID categoryId,
        String title,
        String description,
        boolean supportsRental,
        boolean supportsSale,
        boolean isPublished
    ) {
        this.categoryId = categoryId;
        this.title = title;
        this.description = description;
        this.supportsRental = supportsRental;
        this.supportsSale = supportsSale;
        this.isPublished = isPublished;
    }

    public UUID getId() { return id; }
    public UUID getShopId() { return shopId; }
    public UUID getCategoryId() { return categoryId; }
    public String getSku() { return sku; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public boolean isSupportsRental() { return supportsRental; }
    public boolean isSupportsSale() { return supportsSale; }
    public boolean isPublished() { return isPublished; }
    public Instant getCreatedAt() { return createdAt; }
}
