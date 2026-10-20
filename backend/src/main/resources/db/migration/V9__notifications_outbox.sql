
-- ============================================
-- DipXinh V9 - Notifications & Outbox
-- ============================================

-- 1. Transactional outbox events
CREATE TABLE outbox_events (
                               id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                               shop_id uuid REFERENCES shops(id),

                               event_type varchar(140) NOT NULL,
                               aggregate_id uuid,

                               payload jsonb NOT NULL,

                               status varchar(24) NOT NULL DEFAULT 'PENDING'
                                   CHECK (
                                       status IN (
                                                  'PENDING',
                                                  'PROCESSING',
                                                  'PUBLISHED',
                                                  'FAILED'
                                           )
                                       ),

                               attempts integer NOT NULL DEFAULT 0,

                               created_at timestamptz NOT NULL DEFAULT now(),
                               next_attempt_at timestamptz NOT NULL DEFAULT now(),
                               published_at timestamptz
);

CREATE INDEX ix_outbox_dispatch
    ON outbox_events(status, next_attempt_at);


-- 2. User notifications
CREATE TABLE notifications (
                               id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

                               shop_id uuid REFERENCES shops(id),

                               recipient_user_id uuid NOT NULL
                                   REFERENCES app_users(id),

                               channel varchar(20) NOT NULL
                                   CHECK (
                                       channel IN ('IN_APP', 'EMAIL')
                                       ),

                               template_code varchar(100) NOT NULL,

                               payload jsonb NOT NULL DEFAULT '{}'::jsonb,

                               status varchar(24) NOT NULL DEFAULT 'PENDING'
                                   CHECK (
                                       status IN (
                                                  'PENDING',
                                                  'SENT',
                                                  'FAILED',
                                                  'READ'
                                           )
                                       ),

                               dedupe_key varchar(140) NOT NULL UNIQUE,

                               created_at timestamptz NOT NULL DEFAULT now(),
                               sent_at timestamptz
);
