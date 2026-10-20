
-- =====================================================
-- DipXinh V7 - Finance, Payment & Deposit
-- =====================================================

-- 1. Payment obligations
CREATE TABLE payment_obligations (
                                     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                     shop_id uuid NOT NULL,
                                     order_id uuid NOT NULL,

                                     kind varchar(32) NOT NULL
                                         CHECK (
                                             kind IN (
                                                      'ADVANCE',
                                                      'RENTAL_BALANCE',
                                                      'SECURITY_DEPOSIT',
                                                      'DELIVERY',
                                                      'ALTERATION',
                                                      'INCIDENT_CHARGE'
                                                 )
                                             ),

                                     amount_due numeric(14,2) NOT NULL
                                         CHECK (amount_due >= 0),

                                     reference_incident_id uuid,

                                     status varchar(24) NOT NULL DEFAULT 'OPEN'
                                         CHECK (
                                             status IN (
                                                        'OPEN',
                                                        'PARTIALLY_PAID',
                                                        'PAID',
                                                        'WAIVED',
                                                        'CANCELLED'
                                                 )
                                             ),

                                     UNIQUE (shop_id, id),

                                     FOREIGN KEY (shop_id, order_id)
                                         REFERENCES rental_orders(shop_id, id),

                                     FOREIGN KEY (shop_id, reference_incident_id)
                                         REFERENCES rental_incidents(shop_id, id)
);


-- 2. Payment transactions
CREATE TABLE payment_transactions (
                                      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                      shop_id uuid NOT NULL,
                                      order_id uuid NOT NULL,
                                      obligation_id uuid,

                                      kind varchar(20) NOT NULL
                                          CHECK (
                                              kind IN ('COLLECTION', 'REFUND')
                                              ),

                                      method varchar(24) NOT NULL
                                          CHECK (
                                              method IN ('CASH', 'BANK_TRANSFER')
                                              ),

                                      status varchar(24) NOT NULL DEFAULT 'PENDING'
                                          CHECK (
                                              status IN (
                                                         'PENDING',
                                                         'VERIFIED',
                                                         'REJECTED',
                                                         'REVERSED'
                                                  )
                                              ),

                                      amount numeric(14,2) NOT NULL
                                          CHECK (amount > 0),

                                      idempotency_key varchar(120) NOT NULL,
                                      external_reference varchar(120),

                                      verified_by uuid REFERENCES app_users(id),
                                      verified_at timestamptz,

                                      created_at timestamptz NOT NULL DEFAULT now(),

                                      UNIQUE (shop_id, id),
                                      UNIQUE (shop_id, idempotency_key),

                                      FOREIGN KEY (shop_id, order_id)
                                          REFERENCES rental_orders(shop_id, id),

                                      FOREIGN KEY (shop_id, obligation_id)
                                          REFERENCES payment_obligations(shop_id, id)
);


-- 3. Deposit accounts
CREATE TABLE deposit_accounts (
                                  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                  shop_id uuid NOT NULL,
                                  order_id uuid NOT NULL,

                                  status varchar(24) NOT NULL DEFAULT 'OPEN'
                                      CHECK (
                                          status IN (
                                                     'OPEN',
                                                     'SETTLING',
                                                     'CLOSED'
                                              )
                                          ),

                                  version bigint NOT NULL DEFAULT 0,

                                  UNIQUE (shop_id, id),
                                  UNIQUE (shop_id, order_id),

                                  FOREIGN KEY (shop_id, order_id)
                                      REFERENCES rental_orders(shop_id, id)
);


-- 4. Deposit movements / ledger
CREATE TABLE deposit_movements (
                                   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                   shop_id uuid NOT NULL,
                                   account_id uuid NOT NULL,

                                   transaction_id uuid,
                                   incident_id uuid,

                                   movement_type varchar(32) NOT NULL
                                       CHECK (
                                           movement_type IN (
                                                             'COLLECT',
                                                             'REFUND',
                                                             'APPLY_CHARGE',
                                                             'CORRECTION'
                                               )
                                           ),

                                   signed_amount numeric(14,2) NOT NULL
                                       CHECK (signed_amount <> 0),

                                   idempotency_key varchar(120) NOT NULL,

                                   recorded_by uuid NOT NULL
                                       REFERENCES app_users(id),

                                   created_at timestamptz NOT NULL DEFAULT now(),

                                   UNIQUE (shop_id, id),
                                   UNIQUE (shop_id, idempotency_key),

                                   FOREIGN KEY (shop_id, account_id)
                                       REFERENCES deposit_accounts(shop_id, id),

                                   FOREIGN KEY (shop_id, transaction_id)
                                       REFERENCES payment_transactions(shop_id, id),

                                   FOREIGN KEY (shop_id, incident_id)
                                       REFERENCES rental_incidents(shop_id, id)
);


-- 5. Deposit refund requests
CREATE TABLE deposit_refund_requests (
                                         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                         shop_id uuid NOT NULL,
                                         account_id uuid NOT NULL,

                                         amount numeric(14,2) NOT NULL
                                             CHECK (amount > 0),

                                         status varchar(24) NOT NULL DEFAULT 'PENDING'
                                             CHECK (
                                                 status IN (
                                                            'PENDING',
                                                            'APPROVED',
                                                            'PROCESSING',
                                                            'VERIFIED_REFUNDED',
                                                            'REJECTED',
                                                            'CANCELLED'
                                                     )
                                                 ),

                                         reason text NOT NULL,

                                         early_partial boolean NOT NULL DEFAULT false,

                                         requested_by uuid NOT NULL
                                             REFERENCES app_users(id),

                                         approved_by uuid REFERENCES app_users(id),
                                         payment_transaction_id uuid,

                                         created_at timestamptz NOT NULL DEFAULT now(),

                                         UNIQUE (shop_id, id),

                                         FOREIGN KEY (shop_id, account_id)
                                             REFERENCES deposit_accounts(shop_id, id),

                                         FOREIGN KEY (shop_id, payment_transaction_id)
                                             REFERENCES payment_transactions(shop_id, id)
);


-- 6. Audit logs
CREATE TABLE audit_logs (
                            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                            shop_id uuid REFERENCES shops(id),
                            actor_user_id uuid REFERENCES app_users(id),

                            action varchar(100) NOT NULL,
                            aggregate_type varchar(100) NOT NULL,
                            aggregate_id uuid,

                            before_data jsonb,
                            after_data jsonb,

                            correlation_id varchar(100),
                            occurred_at timestamptz NOT NULL DEFAULT now()
);
