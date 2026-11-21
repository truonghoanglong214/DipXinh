package com.dipxinh.identity.internal.application.service;

import com.dipxinh.identity.internal.application.exception.SlugAlreadyExistsException;
import com.dipxinh.identity.internal.application.port.out.ShopRepository;
import com.dipxinh.identity.internal.application.port.out.ShopSettingRepository;
import com.dipxinh.identity.internal.domain.Shop;
import com.dipxinh.identity.internal.domain.ShopSettings;
import com.dipxinh.identity.internal.domain.ShopStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class ShopService {
    private final ShopRepository shopRepository;
    private final ShopSettingRepository settingRepository;

    public ShopService(ShopRepository shopRepository, ShopSettingRepository settingRepository)
    {
        this.shopRepository = shopRepository;
        this.settingRepository = settingRepository;
    }

    @Transactional
    public Shop createShop(UUID ownerUserId, String name, String slug)
    {
        String normalizedSlug = slug.trim().toLowerCase(Locale.ROOT);

        if(shopRepository.existsBySlug(normalizedSlug))
        {
            throw new SlugAlreadyExistsException("Slug's path: " + normalizedSlug + " already existed");
        }

        Shop newShop = new Shop(
            null,
            normalizedSlug,
            name,
            ShopStatus.ACTIVE,
            ownerUserId,
            Instant.now()
        );

        Shop saved = shopRepository.save(newShop);
        settingRepository.save(ShopSettings.defaultSettings(saved.id()));

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Shop> getMyShops(UUID userId)
    {
        return shopRepository.findAllByOwnerUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<Shop> getBySlug(String slug)
    {
        return shopRepository.findBySlug(slug.trim().toLowerCase(Locale.ROOT));
    }
}
