#!/usr/bin/env bash
# Regenerate supabase-sql-editor-setup.sql from current Prisma schema.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "→ Generating full schema from schema.prisma …"
{
  echo "-- Generated from schema.prisma — do not edit manually"
  yarn --cwd packages/prisma prisma migrate diff \
    --from-empty \
    --to-schema-datamodel ./schema.prisma \
    --script 2>/dev/null
} > scripts/supabase/full-schema.sql

echo "→ Generating Prisma migration baseline …"
node <<'NODE'
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const migrationsDir = path.join("packages/prisma/migrations");
const names = fs.readdirSync(migrationsDir).filter((n) => /^\d/.test(n)).sort();

const lines = [
  "-- Baseline Prisma migration history",
  'CREATE TABLE IF NOT EXISTS "_prisma_migrations" (',
  '    "id" VARCHAR(36) PRIMARY KEY,',
  '    "checksum" VARCHAR(64) NOT NULL,',
  '    "finished_at" TIMESTAMPTZ,',
  '    "migration_name" VARCHAR(255) NOT NULL,',
  '    "logs" TEXT,',
  '    "rolled_back_at" TIMESTAMPTZ,',
  '    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),',
  '    "applied_steps_count" INTEGER NOT NULL DEFAULT 0',
  ");",
  "",
];

for (const name of names) {
  const file = path.join(migrationsDir, name, "migration.sql");
  const content = fs.readFileSync(file, "utf8");
  const checksum = crypto.createHash("sha256").update(content).digest("hex");
  const id = crypto.randomUUID();
  lines.push(
    `INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")`,
    `SELECT '${id}', '${checksum}', NOW(), '${name}', NOW(), 1`,
    `WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '${name}');`,
    ""
  );
}

fs.writeFileSync("scripts/supabase/001_prisma_baseline.sql", lines.join("\n"));
console.log("Baseline rows:", names.length);
NODE

{
  echo "-- PraxisTermin: complete Supabase setup (run once in SQL Editor)"
  echo "-- Supabase → SQL Editor → New query → paste → Run"
  echo ""
  cat scripts/supabase/000_bootstrap.sql
  echo ""
  cat scripts/supabase/full-schema.sql
  echo ""
  cat scripts/supabase/001_prisma_baseline.sql
} > scripts/supabase/supabase-sql-editor-setup.sql

echo "✓ Wrote scripts/supabase/supabase-sql-editor-setup.sql"
