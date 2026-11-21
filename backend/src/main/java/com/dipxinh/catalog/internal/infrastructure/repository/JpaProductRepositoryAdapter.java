package com.dipxinh.catalog.internal.infrastructure.repository;

import com.dipxinh.catalog.internal.application.port.out.ProductRepository;
import com.dipxinh.catalog.internal.domain.Product;
import com.dipxinh.catalog.internal.infrastructure.entity.ProductEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaProductRepositoryAdapter implements ProductRepository {
    private final SpringDataProductRepository repository;

    public JpaProductRepositoryAdapter(SpringDataProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public Product save(Product product) {
        ProductEntity entity;
        if (product.id() != null && repository.existsById(product.id())) {
            entity = repository.findById(product.id()).orElseThrow();
            entity.update(
                product.categoryId(),
                product.title(),
                product.description(),
                product.supportsRental(),
                product.supportsSale(),
                product.isPublished()
            );
        } else {
            entity = new ProductEntity(
                product.shopId(),
                product.categoryId(),
                product.sku(),
                product.title(),
                product.description(),
                product.supportsRental(),
                product.supportsSale(),
                product.isPublished()
            );
        }
        ProductEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Product> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Product> findByShopIdAndId(UUID shopId, UUID id) {
        return repository.findByShopIdAndId(shopId, id).map(this::toDomain);
    }

    @Override
    public List<Product> findAllByShopId(UUID shopId) {
        return repository.findAllByShopId(shopId).stream()
            .map(this::toDomain)
            .toList();
    }

    @Override
    public boolean existsByShopIdAndSku(UUID shopId, String sku) {
        return repository.existsByShopIdAndSku(shopId, sku);
    }

    private Product toDomain(ProductEntity entity) {
        return new Product(
            entity.getId(),
            entity.getShopId(),
            entity.getCategoryId(),
            entity.getSku(),
            entity.getTitle(),
            entity.getDescription(),
            entity.isSupportsRental(),
            entity.isSupportsSale(),
            entity.isPublished(),
            entity.getCreatedAt()
        );
    }
}
