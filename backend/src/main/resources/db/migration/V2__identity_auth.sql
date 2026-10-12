
-- =====================================================
-- DipXinh - V2 Identity & Authentication
-- =====================================================

-- 1. Global user accounts
CREATE TABLE app_users (
                           id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                           email varchar(320) NOT NULL UNIQUE,
                           password_hash text NOT NULL,
                           display_name varchar(160),
                           status varchar(24) NOT NULL DEFAULT 'ACTIVE'
                               CHECK (status IN ('ACTIVE', 'LOCKED', 'DISABLED')),
                           created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Login session for each device/login
CREATE TABLE auth_sessions (
                               id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                               user_id uuid NOT NULL REFERENCES app_users(id),
                               client_label varchar(120),
                               created_at timestamptz NOT NULL DEFAULT now(),
                               last_used_at timestamptz NOT NULL DEFAULT now(),
                               absolute_expires_at timestamptz NOT NULL,
                               revoked_at timestamptz,
                               revocation_reason varchar(60),

                               CHECK (absolute_expires_at > created_at),
                               CHECK (revoked_at IS NULL OR revocation_reason IS NOT NULL),

                               UNIQUE (id, user_id)
);

CREATE INDEX idx_auth_sessions_user_active
    ON auth_sessions(user_id, absolute_expires_at)
    WHERE revoked_at IS NULL;

-- 3. Rotating refresh tokens
CREATE TABLE auth_refresh_tokens (
                                     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                     session_id uuid NOT NULL
                                         REFERENCES auth_sessions(id) ON DELETE CASCADE,

                                     token_hash char(64) NOT NULL UNIQUE,
                                     parent_token_id uuid,

                                     created_at timestamptz NOT NULL DEFAULT now(),
                                     expires_at timestamptz NOT NULL,

                                     used_at timestamptz,
                                     revoked_at timestamptz,
                                     reuse_detected_at timestamptz,

                                     CHECK (token_hash ~ '^[0-9a-f]{64}$'),
    CHECK (expires_at > created_at),

    UNIQUE (session_id, id),
    UNIQUE (parent_token_id),

    FOREIGN KEY (session_id, parent_token_id)
        REFERENCES auth_refresh_tokens(session_id, id)
);

-- Only one unused, non-revoked refresh token per session
CREATE UNIQUE INDEX ux_one_live_refresh_token_per_session
    ON auth_refresh_tokens(session_id)
    WHERE used_at IS NULL AND revoked_at IS NULL;

CREATE INDEX idx_auth_refresh_tokens_session_created
    ON auth_refresh_tokens(session_id, created_at DESC);

CREATE INDEX idx_auth_refresh_tokens_expiration
    ON auth_refresh_tokens(expires_at)
    WHERE used_at IS NULL AND revoked_at IS NULL;
