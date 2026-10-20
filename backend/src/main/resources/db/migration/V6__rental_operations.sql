
-- ==============================================
-- DipXinh V6 - Rental Operations
-- ==============================================

-- 1. Fitting policies
CREATE TABLE fitting_policies (
                                  shop_id uuid PRIMARY KEY REFERENCES shops(id),

                                  slot_minutes integer NOT NULL DEFAULT 60
                                      CHECK (slot_minutes BETWEEN 15 AND 240),

                                  capacity integer NOT NULL DEFAULT 1
                                      CHECK (capacity BETWEEN 1 AND 100),

                                  buffer_minutes integer NOT NULL DEFAULT 0
                                      CHECK (buffer_minutes BETWEEN 0 AND 240),

                                  schedule_rules jsonb NOT NULL DEFAULT '{}'::jsonb
);


-- 2. Fitting appointments
CREATE TABLE fitting_appointments (
                                      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                      shop_id uuid NOT NULL REFERENCES shops(id),
                                      customer_id uuid NOT NULL,

                                      starts_at timestamptz NOT NULL,
                                      ends_at timestamptz NOT NULL,

                                      status varchar(24) NOT NULL DEFAULT 'PENDING'
                                          CHECK (
                                              status IN (
                                                         'PENDING',
                                                         'CONFIRMED',
                                                         'COMPLETED',
                                                         'CANCELLED',
                                                         'NO_SHOW'
                                                  )
                                              ),

                                      notes text,

                                      UNIQUE (shop_id, id),

                                      FOREIGN KEY (shop_id, customer_id)
                                          REFERENCES customer_profiles(shop_id, id),

                                      CHECK (starts_at < ends_at)
);

CREATE INDEX ix_fitting_time
    ON fitting_appointments(shop_id, starts_at, ends_at);


-- 3. Garments for a fitting appointment
CREATE TABLE fitting_items (
                               shop_id uuid NOT NULL,
                               appointment_id uuid NOT NULL,
                               variant_id uuid NOT NULL,

                               PRIMARY KEY (
                                            shop_id,
                                            appointment_id,
                                            variant_id
                                   ),

                               FOREIGN KEY (shop_id, appointment_id)
                                   REFERENCES fitting_appointments(shop_id, id),

                               FOREIGN KEY (shop_id, variant_id)
                                   REFERENCES product_variants(shop_id, id)
);


-- 4. Alteration requests
CREATE TABLE alteration_requests (
                                     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                     shop_id uuid NOT NULL,
                                     rental_unit_id uuid NOT NULL,

                                     order_id uuid,
                                     customer_id uuid,

                                     request_detail text NOT NULL,

                                     assigned_to_user_id uuid REFERENCES app_users(id),
                                     due_at timestamptz,

                                     fee_amount numeric(14,2) NOT NULL DEFAULT 0
                                         CHECK (fee_amount >= 0),

                                     needs_restoration boolean NOT NULL DEFAULT false,

                                     status varchar(24) NOT NULL DEFAULT 'PENDING'
                                         CHECK (
                                             status IN (
                                                        'PENDING',
                                                        'IN_PROGRESS',
                                                        'DONE',
                                                        'RESTORING',
                                                        'CANCELLED'
                                                 )
                                             ),

                                     UNIQUE (shop_id, id),

                                     FOREIGN KEY (shop_id, rental_unit_id)
                                         REFERENCES rental_units(shop_id, id),

                                     FOREIGN KEY (shop_id, order_id)
                                         REFERENCES rental_orders(shop_id, id),

                                     FOREIGN KEY (shop_id, customer_id)
                                         REFERENCES customer_profiles(shop_id, id)
);


-- 5. Delivery and handover tasks
CREATE TABLE delivery_tasks (
                                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                shop_id uuid NOT NULL,
                                order_id uuid NOT NULL,

                                direction varchar(16) NOT NULL
                                    CHECK (direction IN ('OUTBOUND', 'RETURN')),

                                method varchar(24) NOT NULL
                                    CHECK (method IN ('IN_STORE', 'LOCAL_COURIER')),

                                status varchar(28) NOT NULL DEFAULT 'PENDING'
                                    CHECK (
                                        status IN (
                                                   'PENDING',
                                                   'ASSIGNED',
                                                   'IN_TRANSIT',
                                                   'HANDED_OVER',
                                                   'FAILED',
                                                   'CANCELLED'
                                            )
                                        ),

                                scheduled_at timestamptz,
                                handover_at timestamptz,

                                address_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,

                                delivery_fee numeric(14,2) NOT NULL DEFAULT 0
                                    CHECK (delivery_fee >= 0),

                                handover_evidence jsonb NOT NULL DEFAULT '{}'::jsonb,

                                UNIQUE (shop_id, id),

                                FOREIGN KEY (shop_id, order_id)
                                    REFERENCES rental_orders(shop_id, id)
);


-- 6. Return batches
CREATE TABLE return_batches (
                                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                shop_id uuid NOT NULL,
                                order_id uuid NOT NULL,

                                received_at timestamptz NOT NULL,

                                receiver_user_id uuid NOT NULL
                                    REFERENCES app_users(id),

                                notes text,

                                UNIQUE (shop_id, id),

                                FOREIGN KEY (shop_id, order_id)
                                    REFERENCES rental_orders(shop_id, id)
);


-- 7. Items inspected in a return batch
CREATE TABLE return_batch_items (
                                    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                    shop_id uuid NOT NULL,
                                    batch_id uuid NOT NULL,
                                    allocation_id uuid NOT NULL,
                                    rental_unit_id uuid NOT NULL,

                                    condition_code varchar(30) NOT NULL
                                        CHECK (
                                            condition_code IN (
                                                               'NORMAL',
                                                               'CLEANING_NEEDED',
                                                               'DAMAGED',
                                                               'MISSING_ACCESSORY'
                                                )
                                            ),

                                    inspection_notes text,

                                    UNIQUE (shop_id, id),
                                    UNIQUE (shop_id, allocation_id),

                                    FOREIGN KEY (shop_id, batch_id)
                                        REFERENCES return_batches(shop_id, id),

                                    FOREIGN KEY (shop_id, allocation_id)
                                        REFERENCES rental_allocations(shop_id, id),

                                    FOREIGN KEY (shop_id, rental_unit_id)
                                        REFERENCES rental_units(shop_id, id)
);


-- 8. Rental incidents
CREATE TABLE rental_incidents (
                                  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                  shop_id uuid NOT NULL,
                                  order_id uuid NOT NULL,
                                  rental_unit_id uuid,

                                  incident_type varchar(30) NOT NULL
                                      CHECK (
                                          incident_type IN (
                                                            'LATE',
                                                            'DAMAGED',
                                                            'LOST',
                                                            'MISSING_ACCESSORY',
                                                            'OTHER'
                                              )
                                          ),

                                  description text NOT NULL,

                                  proposed_fee numeric(14,2)
                                      CHECK (proposed_fee >= 0),

                                  final_fee numeric(14,2)
                                      CHECK (final_fee >= 0),

                                  status varchar(24) NOT NULL DEFAULT 'REPORTED'
                                      CHECK (
                                          status IN (
                                                     'REPORTED',
                                                     'PENDING_SETTLEMENT',
                                                     'SETTLED',
                                                     'WAIVED'
                                              )
                                          ),

                                  resolved_note text,
                                  resolved_by uuid REFERENCES app_users(id),
                                  resolved_at timestamptz,

                                  UNIQUE (shop_id, id),

                                  FOREIGN KEY (shop_id, order_id)
                                      REFERENCES rental_orders(shop_id, id),

                                  FOREIGN KEY (shop_id, rental_unit_id)
                                      REFERENCES rental_units(shop_id, id)
);
