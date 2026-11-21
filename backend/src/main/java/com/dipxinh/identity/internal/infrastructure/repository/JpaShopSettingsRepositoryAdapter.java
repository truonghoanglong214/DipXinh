package com.dipxinh.identity.internal.infrastructure.repository;

import com.dipxinh.identity.internal.application.port.out.ShopSettingRepository;
import com.dipxinh.identity.internal.domain.ShopSettings;
import com.dipxinh.identity.internal.infrastructure.entity.ShopSettingsEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaShopSettingsRepositoryAdapter implements ShopSettingRepository {
    private final SpringDataShopSettingsRepository settingsRepository;

    public JpaShopSettingsRepositoryAdapter(SpringDataShopSettingsRepository settingsRepository)
    {
        this.settingsRepository = settingsRepository;
    }

    @Override
    public ShopSettings save(ShopSettings settings) {
        ShopSettingsEntity entity = settingsRepository.findById(settings.shopId())
            .map(existing -> {
                existing.update(
                    settings.currency(),
                    settings.timeZone(),
                    settings.storeEnabled(),
                    settings.storefrontTheme()
                );
                return existing;
            })
            .orElseGet(() -> new ShopSettingsEntity(
                settings.shopId(),
                settings.currency(),
                settings.timeZone(),
                settings.storeEnabled(),
                settings.storefrontTheme()
            ));

        ShopSettingsEntity saved = settingsRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<ShopSettings> findByShopId(UUID shopId) {
        return settingsRepository.findById(shopId).map(this::toDomain);
    }

    @Override
    public boolean existsByShopId(UUID shopId) {
        return settingsRepository.existsById(shopId);
    }

    private ShopSettings toDomain(ShopSettingsEntity entity) {
        return new ShopSettings(
            entity.getShopId(),
            entity.getCurrency(),
            entity.getTimeZone(),
            entity.isStoreEnabled(),
            entity.getStorefrontTheme()
        );
    }
}
