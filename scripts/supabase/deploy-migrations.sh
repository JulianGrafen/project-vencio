#!/usr/bin/env bash
# Apply all Prisma migrations to a Supabase Postgres database.
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
for var in DATABASE_URL DATABASE_DIRECT_URL; do
  if [[ -z "${!var:-}" ]]; then
    missing+=("$var")
  fi
done

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

echo "→ Applying Prisma migrations (packages/prisma/migrations) …"
yarn db-deploy

echo ""
echo "✓ Database schema is up to date on Supabase."
echo "  Next steps:"
echo "  - Set the same DATABASE_URL / DATABASE_DIRECT_URL in Vercel → Environment Variables"
echo "  - Redeploy Vercel (migrations also run automatically on build when env is set)"
echo "  - Optional seed: yarn db-seed"
echo "  - Health: GET /api/health/deployment"
