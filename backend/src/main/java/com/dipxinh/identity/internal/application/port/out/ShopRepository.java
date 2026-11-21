package com.dipxinh.identity.internal.application.port.out;

import com.dipxinh.identity.internal.domain.Shop;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShopRepository {
    Shop save(Shop shop);
    Optional<Shop> findById(UUID id);
    Optional<Shop> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Shop> findAllByOwnerUserId(UUID ownerUserId);
}
