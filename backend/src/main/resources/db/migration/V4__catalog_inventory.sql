
-- =====================================================
-- DipXinh V4 - Catalog & Inventory
-- =====================================================

-- 1. Product categories
CREATE TABLE categories (
                            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                            shop_id uuid NOT NULL REFERENCES shops(id),
                            parent_id uuid,
                            name varchar(160) NOT NULL,

                            UNIQUE (shop_id, id),

                            FOREIGN KEY (shop_id, parent_id)
                                REFERENCES categories(shop_id, id)
);


-- 2. Products
CREATE TABLE products (
                          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                          shop_id uuid NOT NULL REFERENCES shops(id),
                          category_id uuid,

                          sku varchar(80) NOT NULL,
                          title varchar(220) NOT NULL,
                          description text,

                          supports_rental boolean NOT NULL DEFAULT true,
                          supports_sale boolean NOT NULL DEFAULT false,
                          is_published boolean NOT NULL DEFAULT false,

                          created_at timestamptz NOT NULL DEFAULT now(),

                          UNIQUE (shop_id, id),
                          UNIQUE (shop_id, sku),

                          FOREIGN KEY (shop_id, category_id)
                              REFERENCES categories(shop_id, id),

                          CHECK (supports_rental OR supports_sale)
);


-- 3. Product variants: size/color
CREATE TABLE product_variants (
                                  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                  shop_id uuid NOT NULL,
                                  product_id uuid NOT NULL,

                                  variant_sku varchar(90) NOT NULL,
                                  size_label varchar(40),
                                  color_label varchar(80),

                                  garment_measurements jsonb NOT NULL
                                                      DEFAULT '{}'::jsonb,

                                  UNIQUE (shop_id, id),
                                  UNIQUE (shop_id, variant_sku),

                                  FOREIGN KEY (shop_id, product_id)
                                      REFERENCES products(shop_id, id)
);


-- 4. Individual physical rental garments
CREATE TABLE rental_units (
                              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                              shop_id uuid NOT NULL,
                              variant_id uuid NOT NULL,

                              qr_token varchar(120) NOT NULL UNIQUE,
                              unit_code varchar(90) NOT NULL,

                              physical_condition varchar(32) NOT NULL DEFAULT 'READY'
                                  CHECK (
                                      physical_condition IN (
                                                             'READY',
                                                             'OUT',
                                                             'CLEANING',
                                                             'ALTERATION',
                                                             'MAINTENANCE',
                                                             'OUT_OF_SERVICE'
                                          )
                                      ),

                              current_measurements jsonb NOT NULL
                                  DEFAULT '{}'::jsonb,

                              actual_ready_at timestamptz,
                              is_retired boolean NOT NULL DEFAULT false,
                              version bigint NOT NULL DEFAULT 0,

                              UNIQUE (shop_id, id),
                              UNIQUE (shop_id, unit_code),

                              FOREIGN KEY (shop_id, variant_id)
                                  REFERENCES product_variants(shop_id, id)
);


-- 5. Quantity-based sales inventory
CREATE TABLE sale_stock (
                            shop_id uuid NOT NULL,
                            variant_id uuid NOT NULL,

                            quantity_on_hand integer NOT NULL DEFAULT 0
                                CHECK (quantity_on_hand >= 0),

                            quantity_reserved integer NOT NULL DEFAULT 0
                                CHECK (quantity_reserved >= 0),

                            version bigint NOT NULL DEFAULT 0,

                            PRIMARY KEY (shop_id, variant_id),

                            FOREIGN KEY (shop_id, variant_id)
                                REFERENCES product_variants(shop_id, id),

                            CHECK (quantity_reserved <= quantity_on_hand)
);


-- 6. Inventory movement history
CREATE TABLE inventory_movements (
                                     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                                     shop_id uuid NOT NULL REFERENCES shops(id),
                                     rental_unit_id uuid,
                                     variant_id uuid,

                                     movement_type varchar(48) NOT NULL,
                                     quantity_delta integer,
                                     reason text,

                                     actor_user_id uuid REFERENCES app_users(id),
                                     recorded_at timestamptz NOT NULL DEFAULT now(),

                                     FOREIGN KEY (shop_id, rental_unit_id)
                                         REFERENCES rental_units(shop_id, id),

                                     FOREIGN KEY (shop_id, variant_id)
                                         REFERENCES product_variants(shop_id, id),

                                     CHECK (
                                         rental_unit_id IS NOT NULL
                                             OR variant_id IS NOT NULL
                                         )
);


-- 7. Garment bundles
CREATE TABLE garment_bundles (
                                 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                                 shop_id uuid NOT NULL REFERENCES shops(id),

                                 code varchar(80) NOT NULL,
                                 name varchar(160) NOT NULL,

                                 UNIQUE (shop_id, id),
                                 UNIQUE (shop_id, code)
);


-- 8. Bundle components
CREATE TABLE bundle_components (
                                   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                                   shop_id uuid NOT NULL,
                                   bundle_id uuid NOT NULL,
                                   variant_id uuid NOT NULL,

                                   is_optional boolean NOT NULL DEFAULT false,
                                   quantity integer NOT NULL DEFAULT 1
                                       CHECK (quantity > 0),

                                   UNIQUE (shop_id, id),

                                   FOREIGN KEY (shop_id, bundle_id)
                                       REFERENCES garment_bundles(shop_id, id),

                                   FOREIGN KEY (shop_id, variant_id)
                                       REFERENCES product_variants(shop_id, id)
);
