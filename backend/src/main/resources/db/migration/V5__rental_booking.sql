
-- =====================================================
-- DipXinh V5 - Rental Booking
-- =====================================================

-- 1. Customers belonging to a shop
CREATE TABLE customer_profiles (
                                   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                   shop_id uuid NOT NULL REFERENCES shops(id),
                                   user_id uuid REFERENCES app_users(id),
                                   contact_name varchar(160) NOT NULL,
                                   contact_email varchar(320),
                                   contact_phone varchar(40),
                                   measurements jsonb NOT NULL DEFAULT '{}'::jsonb,

                                   UNIQUE (shop_id, id),
                                   UNIQUE (shop_id, user_id)
);


-- 2. Rental pricing policies
CREATE TABLE rental_price_policies (
                                       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                       shop_id uuid NOT NULL REFERENCES shops(id),
                                       name varchar(120) NOT NULL,
                                       rules jsonb NOT NULL,
                                       version integer NOT NULL DEFAULT 1,
                                       active boolean NOT NULL DEFAULT true,

                                       UNIQUE (shop_id, id)
);


-- 3. Rental orders
CREATE TABLE rental_orders (
                               id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                               shop_id uuid NOT NULL REFERENCES shops(id),
                               customer_id uuid NOT NULL,
                               public_code varchar(60) NOT NULL,

                               status varchar(40) NOT NULL DEFAULT 'PENDING_REVIEW'
                                   CHECK (
                                       status IN (
                                                  'PENDING_REVIEW',
                                                  'PENDING_PAYMENT',
                                                  'CONFIRMED',
                                                  'IN_PROGRESS',
                                                  'PARTIALLY_RETURNED',
                                                  'SETTLEMENT_PENDING',
                                                  'COMPLETED',
                                                  'CANCELLED',
                                                  'EXPIRED'
                                           )
                                       ),

                               event_at timestamptz,
                               pickup_at timestamptz NOT NULL,
                               return_due_at timestamptz NOT NULL,

                               pickup_method varchar(24) NOT NULL DEFAULT 'IN_STORE'
                                   CHECK (
                                       pickup_method IN ('IN_STORE', 'LOCAL_DELIVERY')
                                       ),

                               return_method varchar(24) NOT NULL DEFAULT 'IN_STORE'
                                   CHECK (
                                       return_method IN ('IN_STORE', 'LOCAL_COLLECTION')
                                       ),

                               rental_amount numeric(14, 2) NOT NULL DEFAULT 0
                                   CHECK (rental_amount >= 0),

                               services_amount numeric(14, 2) NOT NULL DEFAULT 0
                                   CHECK (services_amount >= 0),

                               currency char(3) NOT NULL DEFAULT 'VND',

                               cancellation_policy_snapshot jsonb NOT NULL
                                   DEFAULT '{}'::jsonb,

                               price_snapshot jsonb NOT NULL
                                   DEFAULT '{}'::jsonb,

                               created_at timestamptz NOT NULL DEFAULT now(),
                               confirmed_at timestamptz,
                               version bigint NOT NULL DEFAULT 0,

                               UNIQUE (shop_id, id),
                               UNIQUE (shop_id, public_code),

                               FOREIGN KEY (shop_id, customer_id)
                                   REFERENCES customer_profiles(shop_id, id),

                               CHECK (pickup_at < return_due_at)
);


-- 4. Items included in rental orders
CREATE TABLE rental_order_items (
                                    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                    shop_id uuid NOT NULL,
                                    order_id uuid NOT NULL,
                                    variant_id uuid NOT NULL,
                                    bundle_id uuid,

                                    quantity integer NOT NULL
                                        CHECK (quantity > 0),

                                    agreed_unit_price numeric(14, 2) NOT NULL
                                        CHECK (agreed_unit_price >= 0),

                                    snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,

                                    UNIQUE (shop_id, id),

                                    FOREIGN KEY (shop_id, order_id)
                                        REFERENCES rental_orders(shop_id, id),

                                    FOREIGN KEY (shop_id, variant_id)
                                        REFERENCES product_variants(shop_id, id),

                                    FOREIGN KEY (shop_id, bundle_id)
                                        REFERENCES garment_bundles(shop_id, id)
);


-- 5. Reservation holds
CREATE TABLE reservation_holds (
                                   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                   shop_id uuid NOT NULL,
                                   order_id uuid NOT NULL,

                                   status varchar(24) NOT NULL DEFAULT 'ACTIVE'
                                       CHECK (
                                           status IN (
                                                      'ACTIVE',
                                                      'CONFIRMED',
                                                      'EXPIRED',
                                                      'CANCELLED'
                                               )
                                           ),

                                   expires_at timestamptz NOT NULL,
                                   extension_count integer NOT NULL DEFAULT 0
                                       CHECK (extension_count >= 0),

                                   created_at timestamptz NOT NULL DEFAULT now(),

                                   UNIQUE (shop_id, id),

                                   FOREIGN KEY (shop_id, order_id)
                                       REFERENCES rental_orders(shop_id, id)
);


-- 6. Allocation of individual physical QR units
CREATE TABLE rental_allocations (
                                    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                    shop_id uuid NOT NULL,
                                    order_id uuid NOT NULL,
                                    item_id uuid NOT NULL,
                                    rental_unit_id uuid NOT NULL,
                                    hold_id uuid,

                                    start_at timestamptz NOT NULL,
                                    end_at timestamptz NOT NULL,

                                    block_start_at timestamptz NOT NULL,
                                    block_end_at timestamptz NOT NULL,

                                    booked_window tstzrange GENERATED ALWAYS AS (
                                        tstzrange(
                                            block_start_at,
                                            block_end_at,
                                            '[)'
                                        )
                                        ) STORED,

                                    status varchar(24) NOT NULL
                                        CHECK (
                                            status IN (
                                                       'HELD',
                                                       'CONFIRMED',
                                                       'RELEASED',
                                                       'CANCELLED',
                                                       'EXPIRED'
                                                )
                                            ),

                                    created_at timestamptz NOT NULL DEFAULT now(),

                                    UNIQUE (shop_id, id),

                                    FOREIGN KEY (shop_id, order_id)
                                        REFERENCES rental_orders(shop_id, id),

                                    FOREIGN KEY (shop_id, item_id)
                                        REFERENCES rental_order_items(shop_id, id),

                                    FOREIGN KEY (shop_id, rental_unit_id)
                                        REFERENCES rental_units(shop_id, id),

                                    FOREIGN KEY (shop_id, hold_id)
                                        REFERENCES reservation_holds(shop_id, id),

                                    CHECK (start_at < end_at),
                                    CHECK (block_start_at <= start_at),
                                    CHECK (end_at <= block_end_at),
                                    CHECK (block_start_at < block_end_at),

                                    CONSTRAINT no_same_unit_overlapping_active_bookings
                                        EXCLUDE USING gist (
            shop_id WITH =,
            rental_unit_id WITH =,
            booked_window WITH &&
        )
        WHERE (
            status IN ('HELD', 'CONFIRMED')
        )
);

CREATE INDEX ix_rental_allocations_order
    ON rental_allocations(shop_id, order_id, status);

CREATE INDEX ix_rental_holds_due
    ON reservation_holds(expires_at)
    WHERE status = 'ACTIVE';


-- 7. Unavailability due to cleaning, damage, etc.
CREATE TABLE unit_unavailability (
                                     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                     shop_id uuid NOT NULL,
                                     rental_unit_id uuid NOT NULL,

                                     reason varchar(40) NOT NULL
                                         CHECK (
                                             reason IN (
                                                        'CLEANING',
                                                        'ALTERATION',
                                                        'MAINTENANCE',
                                                        'DAMAGE',
                                                        'OTHER'
                                                 )
                                             ),

                                     expected_ready_at timestamptz,
                                     actual_ready_at timestamptz,

                                     blocked_from timestamptz NOT NULL,
                                     blocked_until timestamptz,

                                     status varchar(24) NOT NULL DEFAULT 'OPEN'
                                         CHECK (
                                             status IN (
                                                        'OPEN',
                                                        'RELEASED',
                                                        'CANCELLED'
                                                 )
                                             ),

                                     note text,

                                     UNIQUE (shop_id, id),

                                     FOREIGN KEY (shop_id, rental_unit_id)
                                         REFERENCES rental_units(shop_id, id)
);

CREATE INDEX ix_unit_unavailability_open
    ON unit_unavailability(
                           shop_id, rental_unit_id, status
        );


-- 8. Operational conflicts
CREATE TABLE operational_conflicts (
                                       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                       shop_id uuid NOT NULL,
                                       order_id uuid NOT NULL,
                                       rental_unit_id uuid NOT NULL,
                                       unavailability_id uuid,

                                       status varchar(30) NOT NULL DEFAULT 'OPEN'
                                           CHECK (
                                               status IN (
                                                          'OPEN',
                                                          'IN_REVIEW',
                                                          'RESOLVED'
                                                   )
                                               ),

                                       description text NOT NULL,
                                       created_at timestamptz NOT NULL DEFAULT now(),

                                       UNIQUE (shop_id, id),

                                       FOREIGN KEY (shop_id, order_id)
                                           REFERENCES rental_orders(shop_id, id),

                                       FOREIGN KEY (shop_id, rental_unit_id)
                                           REFERENCES rental_units(shop_id, id),

                                       FOREIGN KEY (shop_id, unavailability_id)
                                           REFERENCES unit_unavailability(shop_id, id)
);


-- 9. Audited changes to rental orders
CREATE TABLE order_amendments (
                                  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                  shop_id uuid NOT NULL,
                                  order_id uuid NOT NULL,

                                  type varchar(40) NOT NULL,
                                  before_state jsonb NOT NULL,
                                  after_state jsonb NOT NULL,

                                  reason text,
                                  actor_user_id uuid NOT NULL
                                      REFERENCES app_users(id),

                                  approved_at timestamptz,
                                  created_at timestamptz NOT NULL DEFAULT now(),

                                  FOREIGN KEY (shop_id, order_id)
                                      REFERENCES rental_orders(shop_id, id)
);


-- 10. Customer waitlist
CREATE TABLE waitlist_entries (
                                  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                  shop_id uuid NOT NULL REFERENCES shops(id),
                                  customer_id uuid NOT NULL,
                                  variant_id uuid NOT NULL,

                                  wanted_pickup_at timestamptz NOT NULL,
                                  wanted_return_due_at timestamptz NOT NULL,

                                  status varchar(24) NOT NULL DEFAULT 'WAITING'
                                      CHECK (
                                          status IN (
                                                     'WAITING',
                                                     'NOTIFIED',
                                                     'CONVERTED',
                                                     'CANCELLED',
                                                     'EXPIRED'
                                              )
                                          ),

                                  created_at timestamptz NOT NULL DEFAULT now(),

                                  UNIQUE (shop_id, id),

                                  FOREIGN KEY (shop_id, customer_id)
                                      REFERENCES customer_profiles(shop_id, id),

                                  FOREIGN KEY (shop_id, variant_id)
                                      REFERENCES product_variants(shop_id, id),

                                  CHECK (wanted_pickup_at < wanted_return_due_at)
);
