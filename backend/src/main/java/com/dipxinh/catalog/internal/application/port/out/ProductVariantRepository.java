package com.dipxinh.catalog.internal.application.port.out;

import com.dipxinh.catalog.internal.domain.ProductVariant;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductVariantRepository {
    ProductVariant save(ProductVariant variant);
    Optional<ProductVariant> findById(UUID id);
    List<ProductVariant> findAllByProductId(UUID productId);
    List<ProductVariant> findAllByShopIdAndProductId(UUID shopId, UUID productId);
    boolean existsByShopIdAndVariantSku(UUID shopId, String variantSku);
}
