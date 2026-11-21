package com.dipxinh.inventory.internal.infrastructure.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class SaleStockId implements Serializable {

    @Column(name = "shop_id", nullable = false)
    private UUID shopId;

    @Column(name = "variant_id", nullable = false)
    private UUID variantId;

    public SaleStockId() {}

    public SaleStockId(UUID shopId, UUID variantId) {
        this.shopId = shopId;
        this.variantId = variantId;
    }

    public UUID getShopId() { return shopId; }
    public UUID getVariantId() { return variantId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SaleStockId that = (SaleStockId) o;
        return Objects.equals(shopId, that.shopId) && Objects.equals(variantId, that.variantId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(shopId, variantId);
    }
}
