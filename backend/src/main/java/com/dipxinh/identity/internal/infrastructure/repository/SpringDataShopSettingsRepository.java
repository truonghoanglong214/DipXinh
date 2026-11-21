package com.dipxinh.identity.internal.infrastructure.repository;

import com.dipxinh.identity.internal.infrastructure.entity.ShopSettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataShopSettingsRepository extends JpaRepository<ShopSettingsEntity, UUID> {
}
