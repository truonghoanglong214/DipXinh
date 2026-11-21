package com.dipxinh.identity.internal.infrastructure.repository;

import com.dipxinh.identity.internal.infrastructure.entity.ShopEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataShopRepository extends JpaRepository<ShopEntity, UUID> {
    Optional<ShopEntity> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<ShopEntity> findAllByOwnerUserIdOrderByCreatedAtDesc(UUID ownerUserId);
}
