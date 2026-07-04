#!/usr/bin/env bash
# Apply Supabase bootstrap SQL + all Prisma migrations.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

missing=()
if [[ -z "${DATABASE_DIRECT_URL:-}" ]]; then
  missing+=("DATABASE_DIRECT_URL")
fi

# Runtime pooler optional for migration-only runs — fall back to direct URL
if [[ -z "${DATABASE_URL:-}" ]]; then
  if [[ -n "${DATABASE_DIRECT_URL:-}" ]]; then
    export DATABASE_URL="${DATABASE_DIRECT_URL}"
    echo "Note: DATABASE_URL not set — using DATABASE_DIRECT_URL for this migration run."
  else
    missing+=("DATABASE_URL")
  fi
fi

if [[ ${#missing[@]} -gt 0 ]]; then
  echo "Error: Missing required environment variables: ${missing[*]}"
  echo ""
  echo "1. Create a Supabase project (EU region recommended)"
  echo "2. Copy scripts/supabase/env.example → .env and fill in connection strings"
  echo "3. Re-run: yarn db:supabase-deploy"
  echo ""
  echo "See docs/dental/SUPABASE.md for the full guide."
  exit 1
fi

if [[ "${DATABASE_URL}" != *"supabase"* ]] && [[ "${DATABASE_DIRECT_URL}" != *"supabase"* ]]; then
  echo "Warning: DATABASE_URL does not look like Supabase. Continuing anyway."
fi

if [[ "${DATABASE_URL}" == "${DATABASE_DIRECT_URL}" ]]; then
  echo "Warning: DATABASE_URL and DATABASE_DIRECT_URL are identical."
  echo "For Supabase, use port 6543 (pooler) for DATABASE_URL and port 5432 for DATABASE_DIRECT_URL."
fi

echo "→ Step 1/3: Supabase bootstrap (extensions via direct connection) …"
(
  cd packages/prisma
  DATABASE_URL="${DATABASE_DIRECT_URL}" yarn prisma db execute \
    --file ../../scripts/supabase/000_bootstrap.sql \
    --schema ./schema.prisma
)

echo "→ Step 2/3: Prisma migrations (packages/prisma/migrations, ~600 files) …"
yarn db-deploy

echo "→ Step 3/3: Migration status …"
yarn workspace @calcom/prisma db:migrate-status

echo ""
echo "✓ Supabase database schema is up to date."
echo "  Next steps:"
echo "  - Set DATABASE_URL + DATABASE_DIRECT_URL in Vercel → Environment Variables"
echo "  - Redeploy Vercel"
echo "  - Optional seed: yarn db-seed"
echo "  - Health: GET /api/health/deployment"
