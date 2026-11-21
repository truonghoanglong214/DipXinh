package com.dipxinh.inventory.internal.infrastructure.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sale_stock")
public class SaleStockEntity {

    @EmbeddedId
    private SaleStockId id;

    @Column(name = "quantity_on_hand", nullable = false)
    private int quantityOnHand = 0;

    @Column(name = "quantity_reserved", nullable = false)
    private int quantityReserved = 0;

    @Version
    @Column(name = "version", nullable = false)
    private long version = 0L;

    protected SaleStockEntity() {}

    public SaleStockEntity(SaleStockId id, int quantityOnHand, int quantityReserved) {
        this.id = id;
        this.quantityOnHand = Math.max(0, quantityOnHand);
        this.quantityReserved = Math.max(0, quantityReserved);
        this.version = 0L;
    }

    public void adjustStock(int delta) {
        int updated = this.quantityOnHand + delta;
        if (updated < 0) {
            throw new IllegalArgumentException("Quantity on hand cannot become negative");
        }
        this.quantityOnHand = updated;
    }

    public void reserve(int count) {
        if (this.quantityReserved + count > this.quantityOnHand) {
            throw new IllegalStateException("Cannot reserve more than available quantity on hand");
        }
        this.quantityReserved += count;
    }

    public void release(int count) {
        this.quantityReserved = Math.max(0, this.quantityReserved - count);
    }

    public SaleStockId getId() { return id; }
    public int getQuantityOnHand() { return quantityOnHand; }
    public int getQuantityReserved() { return quantityReserved; }
    public long getVersion() { return version; }
}
