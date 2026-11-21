package com.dipxinh.catalog.internal.infrastructure.repository;

import com.dipxinh.catalog.internal.infrastructure.entity.ProductVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataProductVariantRepository extends JpaRepository<ProductVariantEntity, UUID> {
    List<ProductVariantEntity> findAllByProductId(UUID productId);
    List<ProductVariantEntity> findAllByShopIdAndProductId(UUID shopId, UUID productId);
    boolean existsByShopIdAndVariantSku(UUID shopId, String variantSku);
}
