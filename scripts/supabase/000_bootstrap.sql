-- Supabase bootstrap: run once before Prisma migrations (idempotent).
-- Requires DATABASE_DIRECT_URL (port 5432, not transaction pooler).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Prisma migrations use gen_random_uuid() throughout the history.
-- pgcrypto is pre-enabled on most Supabase projects; this is a safety net.
