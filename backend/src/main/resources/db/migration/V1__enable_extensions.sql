
-- Required PostgreSQL extensions for DipXinh

-- UUID generation support
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- GiST support for rental allocation constraints
CREATE EXTENSION IF NOT EXISTS btree_gist;
