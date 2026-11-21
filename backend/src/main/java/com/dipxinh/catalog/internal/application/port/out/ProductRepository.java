package com.dipxinh.catalog.internal.application.port.out;

import com.dipxinh.catalog.internal.domain.Product;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository {
    Product save(Product product);
    Optional<Product> findById(UUID id);
    Optional<Product> findByShopIdAndId(UUID shopId, UUID id);
    List<Product> findAllByShopId(UUID shopId);
    boolean existsByShopIdAndSku(UUID shopId, String sku);
}
