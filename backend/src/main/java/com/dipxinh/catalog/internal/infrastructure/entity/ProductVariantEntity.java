package com.dipxinh.catalog.internal.infrastructure.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.UUID;

@Entity
@Table(
    name = "product_variants",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_product_variants_shop_id", columnNames = {"shop_id", "id"}),
        @UniqueConstraint(name = "uk_product_variants_shop_sku", columnNames = {"shop_id", "variant_sku"})
    }
)
public class ProductVariantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "shop_id", nullable = false)
    private UUID shopId;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "variant_sku", nullable = false, length = 90)
    private String variantSku;

    @Column(name = "size_label", length = 40)
    private String sizeLabel;

    @Column(name = "color_label", length = 80)
    private String colorLabel;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "garment_measurements", nullable = false, columnDefinition = "jsonb")
    private String garmentMeasurements = "{}";

    protected ProductVariantEntity() {}

    public ProductVariantEntity(
        UUID shopId,
        UUID productId,
        String variantSku,
        String sizeLabel,
        String colorLabel,
        String garmentMeasurements
    ) {
        this.shopId = shopId;
        this.productId = productId;
        this.variantSku = variantSku;
        this.sizeLabel = sizeLabel;
        this.colorLabel = colorLabel;
        this.garmentMeasurements = garmentMeasurements != null ? garmentMeasurements : "{}";
    }

    public void update(
        String sizeLabel,
        String colorLabel,
        String garmentMeasurements
    ) {
        this.sizeLabel = sizeLabel;
        this.colorLabel = colorLabel;
        if (garmentMeasurements != null) {
            this.garmentMeasurements = garmentMeasurements;
        }
    }

    public UUID getId() { return id; }
    public UUID getShopId() { return shopId; }
    public UUID getProductId() { return productId; }
    public String getVariantSku() { return variantSku; }
    public String getSizeLabel() { return sizeLabel; }
    public String getColorLabel() { return colorLabel; }
    public String getGarmentMeasurements() { return garmentMeasurements; }
}
