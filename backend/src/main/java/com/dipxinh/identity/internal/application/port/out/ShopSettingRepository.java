package com.dipxinh.identity.internal.application.port.out;


import com.dipxinh.identity.internal.domain.ShopSettings;

import java.util.Optional;
import java.util.UUID;

public interface ShopSettingRepository {
    ShopSettings save(ShopSettings settings);
    Optional<ShopSettings> findByShopId(UUID shopId);
    boolean existsByShopId(UUID shopId);
}
