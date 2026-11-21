package com.dipxinh.identity.internal.domain;

import java.util.UUID;

public record ShopSettings(
    UUID shopId,
    String currency,
    String timeZone,
    boolean storeEnabled,
    String storefrontTheme
) {
    public static final String DEFAULT_CURRENCY = "VND";
    public static final String DEFAULT_TIME_ZONE = "Asia/Ho_Chi_Minh";
    public static final String DEFAULT_STOREFRONT_THEME = "{\"primaryColor\": \"#713F4B\", \"accentColor\": \"#A46877\", \"fontFamily\": \"Inter\"}";

    public static ShopSettings defaultSettings(UUID shopId) {
        return new ShopSettings(
            shopId,
            DEFAULT_CURRENCY,
            DEFAULT_TIME_ZONE,
            true,
            DEFAULT_STOREFRONT_THEME
        );
    }
}
