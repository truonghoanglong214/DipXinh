package com.dipxinh.inventory.internal.domain;

import java.util.UUID;

public record SaleStock(
    UUID shopId,
    UUID variantId,
    int quantityOnHand,
    int quantityReserved,
    long version
) {
    public int availableQuantity() {
        return Math.max(0, quantityOnHand - quantityReserved);
    }
}
