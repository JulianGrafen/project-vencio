# Supabase Datenbank — Komplett-Setup

**Scope:** PraxisTermin / project-vencio — PostgreSQL auf Supabase für Vercel Production  
**Last updated:** 2026-07-04

---

## 1. Supabase-Projekt anlegen

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. **Region:** `eu-central-1` (Frankfurt) — empfohlen für EU-/Dental-Deployments
3. **Database password** sicher notieren (wird nur einmal angezeigt)
4. Warten bis das Projekt **Active** ist (~2 Minuten)

---

## 2. Connection Strings kopieren

Im Supabase Dashboard: **Project Settings → Database → Connection string**

| Variable | Modus | Port | Verwendung |
|----------|--------|------|------------|
| `DATABASE_URL` | **Transaction** pooler | `6543` | Vercel Runtime (Serverless) |
| `DATABASE_DIRECT_URL` | **Session** pooler oder **Direct** | `5432` | `yarn db-deploy` / Prisma Migrate |

**Wichtig für Prisma:**

- `DATABASE_URL` muss `?pgbouncer=true` enthalten (Transaction-Modus)
- `DATABASE_DIRECT_URL` darf **nicht** den Transaction-Pooler (6543 + pgbouncer) für Migrationen nutzen — Session (5432) oder Direct Host

Beispiel (Platzhalter ersetzen):

```bash
# Runtime — Transaction pooler
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Migrationen — Session pooler oder Direct
DATABASE_DIRECT_URL="postgresql://postgres.abcdefghijklmnop:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

Direct-Alternative für Migrationen:

```bash
DATABASE_DIRECT_URL="postgresql://postgres:[PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres"
```

Vorlage: [`scripts/supabase/env.example`](../../scripts/supabase/env.example)

---

## 3. Schema auf Supabase deployen

Lokal (einmalig oder bei jedem Schema-Update):

```bash
# 1. Env anlegen
cp scripts/supabase/env.example .env
# → Passwörter und Project Ref eintragen

# 2. Migrationen anwenden (~600 SQL-Dateien)
yarn db:supabase-deploy

# 3. Optional: Demo-/Basisdaten
yarn db-seed
```

Das Script [`scripts/supabase/deploy-migrations.sh`](../../scripts/supabase/deploy-migrations.sh) führt `yarn db-deploy` (= `prisma migrate deploy`) aus.

---

## 4. Vercel verbinden

**Vercel → Project → Settings → Environment Variables** (Production):

| Variable | Wert |
|----------|------|
| `DATABASE_URL` | Transaction pooler (6543) |
| `DATABASE_DIRECT_URL` | Session/Direct (5432) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `CALENDSO_ENCRYPTION_KEY` | `openssl rand -base64 24` |
| `NEXT_PUBLIC_WEBAPP_URL` | `https://deine-app.vercel.app` |
| `NEXTAUTH_URL` | `https://deine-app.vercel.app/api/auth` |

Danach **Redeploy**. Beim Build wendet `@calcom/prisma` automatisch fehlende Migrationen an (`auto-migrations.ts`), sofern beide DB-URLs gesetzt sind.

---

## 5. Prüfen

| Check | Erwartung |
|-------|-----------|
| `GET /api/health/deployment` | `ready: true` |
| `GET /api/health/dental` | `200` (wenn Dental-Env gesetzt) |
| Supabase → Table Editor | Tabellen z. B. `User`, `Booking`, `Team` |
| App `/` | Redirect zu `/auth/setup` (kein User) oder `/auth/login` |

Ohne DB-Config zeigt die App **`/deploy`** mit Checkliste.

---

## 6. CI / GitHub Actions (optional)

Workflow **Supabase Migrate** (manuell): `.github/workflows/supabase-migrate.yml`

Repository Secrets setzen:

- `DATABASE_URL`
- `DATABASE_DIRECT_URL`

→ Actions → **Supabase Migrate** → Run workflow

---

## 7. Troubleshooting

| Problem | Lösung |
|---------|--------|
| `P1001: Can't reach database` | IP-Allowlist in Supabase prüfen; „Allow all“ für Serverless |
| Migration hängt / timeout | `DATABASE_DIRECT_URL` auf Direct (5432) stellen |
| `prepared statement` Fehler | `DATABASE_URL` muss `?pgbouncer=true` haben |
| App zeigt `/deploy` | Env in Vercel Production prüfen + Redeploy |
| 500 nach Login | Migrationen fehlen → `yarn db:supabase-deploy` |

---

## 8. Dental Production (zusätzlich)

Siehe [`DEPLOYMENT.md`](./DEPLOYMENT.md) für `DENTAL_ENCRYPTION_ENABLED`, `DENTAL_KMS_MASTER_KEY`, SMTP, Cron.
