package com.dipxinh.catalog.internal.infrastructure.repository;

import com.dipxinh.catalog.internal.application.port.out.ProductVariantRepository;
import com.dipxinh.catalog.internal.domain.ProductVariant;
import com.dipxinh.catalog.internal.infrastructure.entity.ProductVariantEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaProductVariantRepositoryAdapter implements ProductVariantRepository {
    private final SpringDataProductVariantRepository repository;

    public JpaProductVariantRepositoryAdapter(SpringDataProductVariantRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProductVariant save(ProductVariant variant) {
        ProductVariantEntity entity;
        if (variant.id() != null && repository.existsById(variant.id())) {
            entity = repository.findById(variant.id()).orElseThrow();
            entity.update(
                variant.sizeLabel(),
                variant.colorLabel(),
                variant.garmentMeasurements()
            );
        } else {
            entity = new ProductVariantEntity(
                variant.shopId(),
                variant.productId(),
                variant.variantSku(),
                variant.sizeLabel(),
                variant.colorLabel(),
                variant.garmentMeasurements()
            );
        }
        ProductVariantEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<ProductVariant> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<ProductVariant> findAllByProductId(UUID productId) {
        return repository.findAllByProductId(productId).stream()
            .map(this::toDomain)
            .toList();
    }

    @Override
    public List<ProductVariant> findAllByShopIdAndProductId(UUID shopId, UUID productId) {
        return repository.findAllByShopIdAndProductId(shopId, productId).stream()
            .map(this::toDomain)
            .toList();
    }

    @Override
    public boolean existsByShopIdAndVariantSku(UUID shopId, String variantSku) {
        return repository.existsByShopIdAndVariantSku(shopId, variantSku);
    }

    private ProductVariant toDomain(ProductVariantEntity entity) {
        return new ProductVariant(
            entity.getId(),
            entity.getShopId(),
            entity.getProductId(),
            entity.getVariantSku(),
            entity.getSizeLabel(),
            entity.getColorLabel(),
            entity.getGarmentMeasurements()
        );
    }
}
