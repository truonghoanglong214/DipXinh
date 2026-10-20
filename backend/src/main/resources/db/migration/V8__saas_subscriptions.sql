
-- =====================================================
-- DipXinh V8 - SaaS Plans & Subscriptions
-- =====================================================

-- 1. Available SaaS plans
CREATE TABLE saas_plans (
                            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                            code varchar(32) NOT NULL UNIQUE,
                            name varchar(100) NOT NULL,

                            staff_limit integer NOT NULL
                                CHECK (staff_limit >= 0),

                            rental_unit_limit integer NOT NULL
                                CHECK (rental_unit_limit >= 0),

                            ai_quota_limit integer NOT NULL DEFAULT 0
                                CHECK (ai_quota_limit >= 0),

                            price_per_month numeric(14,2),

                            is_active boolean NOT NULL DEFAULT true
);


-- 2. Shop subscriptions
CREATE TABLE shop_subscriptions (
                                    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                                    shop_id uuid NOT NULL REFERENCES shops(id),
                                    plan_id uuid NOT NULL REFERENCES saas_plans(id),

                                    status varchar(24) NOT NULL
                                        CHECK (
                                            status IN (
                                                       'TRIALING',
                                                       'ACTIVE',
                                                       'GRACE_PERIOD',
                                                       'RESTRICTED',
                                                       'CANCELLED'
                                                )
                                            ),

                                    starts_at timestamptz NOT NULL,
                                    ends_at timestamptz NOT NULL,
                                    grace_ends_at timestamptz,

                                    created_at timestamptz NOT NULL DEFAULT now(),

                                    UNIQUE (shop_id, id),

                                    CHECK (starts_at < ends_at)
);


-- 3. SaaS invoices
CREATE TABLE saas_invoices (
                               id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                               shop_id uuid NOT NULL REFERENCES shops(id),
                               subscription_id uuid NOT NULL,

                               amount numeric(14,2) NOT NULL
                                   CHECK (amount >= 0),

                               status varchar(24) NOT NULL DEFAULT 'UNPAID'
                                   CHECK (
                                       status IN (
                                                  'UNPAID',
                                                  'PAID',
                                                  'VOID'
                                           )
                                       ),

                               due_at timestamptz,

                               verified_by uuid REFERENCES app_users(id),
                               verified_at timestamptz,

                               UNIQUE (shop_id, id),

                               FOREIGN KEY (shop_id, subscription_id)
                                   REFERENCES shop_subscriptions(shop_id, id)
);
