package com.dipxinh.catalog.internal.infrastructure.repository;

import com.dipxinh.catalog.internal.infrastructure.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataProductRepository extends JpaRepository<ProductEntity, UUID> {
    Optional<ProductEntity> findByShopIdAndId(UUID shopId, UUID id);
    List<ProductEntity> findAllByShopId(UUID shopId);
    boolean existsByShopIdAndSku(UUID shopId, String sku);
}
