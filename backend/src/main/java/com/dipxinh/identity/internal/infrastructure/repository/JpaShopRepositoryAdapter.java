package com.dipxinh.identity.internal.infrastructure.repository;

import com.dipxinh.identity.internal.application.port.out.ShopRepository;
import com.dipxinh.identity.internal.domain.Shop;
import com.dipxinh.identity.internal.infrastructure.entity.ShopEntity;
import com.dipxinh.identity.internal.infrastructure.entity.ShopSettingsEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaShopRepositoryAdapter implements ShopRepository {
    private final SpringDataShopRepository repository;

    public JpaShopRepositoryAdapter(SpringDataShopRepository repository)
    {
        this.repository = repository;
    }

    @Override
    public Shop save(Shop shop) {
        ShopEntity entity;

        if(shop.id() == null)
        {
            entity = new ShopEntity(
                shop.slug(),
                shop.name(),
                shop.ownerUserId()
            );

        }
        else {
            entity = repository.findById(shop.id())
                .orElseThrow(() -> new IllegalStateException("Shop not found with id: " + shop.id()));
            entity.update(shop.name(), shop.status());
        }

        ShopEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Shop> findById(UUID id) {
        return repository.findById(id)
            .map(this::toDomain);
    }

    @Override
    public Optional<Shop> findBySlug(String slug) {
        return repository.findBySlug(slug)
            .map(this::toDomain);
    }

    @Override
    public boolean existsBySlug(String slug) {
        return repository.existsBySlug(slug);
    }

    @Override
    public List<Shop> findAllByOwnerUserId(UUID ownerUserId) {
        return repository.findAllByOwnerUserIdOrderByCreatedAtDesc(ownerUserId)
            .stream()
            .map(this::toDomain)
            .toList();
    }

    private Shop toDomain(ShopEntity entity)
    {
        return new Shop(
            entity.getId(),
            entity.getSlug(),
            entity.getName(),
            entity.getStatus(),
            entity.getOwnerUserId(),
            entity.getCreatedAt()
        );
    }
}
