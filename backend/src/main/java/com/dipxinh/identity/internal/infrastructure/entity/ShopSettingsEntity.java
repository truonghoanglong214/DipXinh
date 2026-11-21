package com.dipxinh.identity.internal.infrastructure.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.UUID;

@Entity
@Table(name = "shop_settings")
public class ShopSettingsEntity {

    @Id
    @Column(name = "shop_id")
    private UUID shopId;

    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "VND";

    @Column(name = "time_zone", nullable = false, length = 60)
    private String timeZone = "Asia/Ho_Chi_Minh";

    @Column(name = "store_enabled", nullable = false)
    private boolean storeEnabled = true;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "storefront_theme", nullable = false, columnDefinition = "jsonb")
    private String storefrontTheme = "{}";

    protected ShopSettingsEntity() {}

    public ShopSettingsEntity(
        UUID shopId,
        String currency,
        String timeZone,
        boolean storeEnabled,
        String storefrontTheme
    ) {
        this.shopId = shopId;
        this.currency = currency != null ? currency : "VND";
        this.timeZone = timeZone != null ? timeZone : "Asia/Ho_Chi_Minh";
        this.storeEnabled = storeEnabled;
        this.storefrontTheme = storefrontTheme != null ? storefrontTheme : "{}";
    }

    public void update(
        String currency,
        String timeZone,
        boolean storeEnabled,
        String storefrontTheme
    ) {
        this.currency = currency;
        this.timeZone = timeZone;
        this.storeEnabled = storeEnabled;
        this.storefrontTheme = storefrontTheme;
    }

    public UUID getShopId() { return shopId; }
    public String getCurrency() { return currency; }
    public String getTimeZone() { return timeZone; }
    public boolean isStoreEnabled() { return storeEnabled; }
    public String getStorefrontTheme() { return storefrontTheme; }
}
