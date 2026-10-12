
-- ============================================
-- DipXinh V3 - Tenant & Permissions
-- ============================================

-- 1. Shops
CREATE TABLE shops (
                       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                       slug varchar(90) NOT NULL UNIQUE,
                       name varchar(200) NOT NULL,

                       status varchar(24) NOT NULL DEFAULT 'ACTIVE'
                           CHECK (status IN (
                                             'ACTIVE', 'RESTRICTED', 'SUSPENDED'
                               )),

                       owner_user_id uuid NOT NULL
                           REFERENCES app_users(id),

                       created_at timestamptz NOT NULL DEFAULT now(),

                       CONSTRAINT shop_slug_format
                           CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
    );

CREATE INDEX idx_shops_owner_user
    ON shops(owner_user_id);


-- 2. Roles defined within a shop
CREATE TABLE shop_roles (
                            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                            shop_id uuid NOT NULL
                                REFERENCES shops(id),

                            code varchar(40) NOT NULL,
                            display_name varchar(120) NOT NULL,

                            UNIQUE (shop_id, id),
                            UNIQUE (shop_id, code)
);


-- 3. User membership in a shop
CREATE TABLE shop_memberships (
                                  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                                  shop_id uuid NOT NULL
                                      REFERENCES shops(id),

                                  user_id uuid NOT NULL
                                      REFERENCES app_users(id),

                                  role_id uuid NOT NULL,

                                  status varchar(20) NOT NULL DEFAULT 'ACTIVE'
                                      CHECK (status IN (
                                                        'INVITED', 'ACTIVE', 'DISABLED'
                                          )),

                                  joined_at timestamptz,

                                  UNIQUE (shop_id, id),
                                  UNIQUE (shop_id, user_id),

                                  FOREIGN KEY (shop_id, role_id)
                                      REFERENCES shop_roles(shop_id, id)
);

CREATE INDEX idx_shop_memberships_user_status
    ON shop_memberships(user_id, status);

CREATE INDEX idx_shop_memberships_shop_status
    ON shop_memberships(shop_id, status);


-- 4. Functional permissions assigned to roles
CREATE TABLE role_permissions (
                                  role_id uuid NOT NULL
                                      REFERENCES shop_roles(id),

                                  permission_code varchar(80) NOT NULL,

                                  PRIMARY KEY (role_id, permission_code)
);


-- 5. Per-shop configuration
CREATE TABLE shop_settings (
                               shop_id uuid PRIMARY KEY
                                   REFERENCES shops(id),

                               currency char(3) NOT NULL DEFAULT 'VND',
                               time_zone varchar(60) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',

                               store_enabled boolean NOT NULL DEFAULT true,

                               storefront_theme jsonb NOT NULL
                                   DEFAULT '{}'::jsonb
);
