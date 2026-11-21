package com.dipxinh.catalog.internal.infrastructure.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(
    name = "categories",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_categories_shop_id", columnNames = {"shop_id", "id"})
    }
)
public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "shop_id", nullable = false)
    private UUID shopId;

    @Column(name = "parent_id")
    private UUID parentId;

    @Column(name = "name", nullable = false, length = 160)
    private String name;

    protected CategoryEntity() {}

    public CategoryEntity(UUID shopId, UUID parentId, String name) {
        this.shopId = shopId;
        this.parentId = parentId;
        this.name = name;
    }

    public void update(String name, UUID parentId) {
        this.name = name;
        this.parentId = parentId;
    }

    public UUID getId() { return id; }
    public UUID getShopId() { return shopId; }
    public UUID getParentId() { return parentId; }
    public String getName() { return name; }
}
