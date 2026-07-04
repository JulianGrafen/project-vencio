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

### Häufiger Fehler in Vercel

| Falsch | Richtig |
|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` als Datenbank | `DATABASE_URL` + `DATABASE_DIRECT_URL` |
| `https://xxxx.supabase.co` | `postgresql://postgres.[ref]:[pass]@…pooler.supabase.com:6543/postgres?pgbouncer=true` |

`NEXT_PUBLIC_SUPABASE_URL` ist nur die **HTTP-API-URL** für den Supabase JavaScript-Client — **nicht** für Prisma/PostgreSQL. Dieses Projekt nutzt Prisma direkt; du brauchst die **Connection string**-URIs aus dem Database-Tab.

In Vercel **zwei separate Variablen** anlegen (Sensitive, Production + Preview):

1. **Name:** `DATABASE_URL` → Transaction pooler URI  
2. **Name:** `DATABASE_DIRECT_URL` → Session/Direct URI  

`NEXT_PUBLIC_SUPABASE_URL` kannst du löschen, sofern du den Supabase JS-Client nicht verwendest.

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

### Option A — Supabase SQL Editor (ohne Yarn, empfohlen wenn kein Terminal)

1. Datei `scripts/supabase/supabase-sql-editor-setup.sql` aus dem Repo öffnen
2. Supabase → **SQL Editor** → New query → Inhalt einfügen → **Run**
3. **Table Editor** prüfen

Details: [SUPABASE-SQL-EDITOR.md](./SUPABASE-SQL-EDITOR.md)

### Option B — Terminal (`yarn db:supabase-deploy`)

```bash
# 1. Env anlegen
cp scripts/supabase/env.example .env
# → Passwörter und Project Ref eintragen

# 2. Bootstrap + alle Migrationen (~600 SQL-Dateien)
yarn db:supabase-deploy
```

Ablauf von `yarn db:supabase-deploy`:

1. **`000_bootstrap.sql`** — `pgcrypto` Extension (für `gen_random_uuid()` in Migrationen)
2. **`prisma migrate deploy`** — alle Dateien unter `packages/prisma/migrations/`
3. **`prisma migrate status`** — Verifikation

Dental-Migrationen (Auszug):

| Migration | Inhalt |
|-----------|--------|
| `20260703230000_dental_practice_encryption` | Practice encryption keys |
| `20260703240000_smart_fill_ai` | Smart-Fill |
| `20260703260000_pvs_sync_outbox` | PVS Outbox |
| `20260703280000_dental_recall` | Recall |
| `20260704110000_practice_trial` | Practice trial |
| `20260704120000_smart_fill_email_invites` | E-Mail invites |

Das Script [`scripts/supabase/deploy-migrations.sh`](../../scripts/supabase/deploy-migrations.sh) orchestriert den gesamten Ablauf.

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
| `gen_random_uuid does not exist` | `yarn db:supabase-deploy` erneut (bootstrap `pgcrypto`) |
| App zeigt `/deploy` | Env in Vercel Production prüfen + Redeploy |
| 500 nach Login | Migrationen fehlen → `yarn db:supabase-deploy` |

---

## 8. Dental Production (zusätzlich)

Siehe [`DEPLOYMENT.md`](./DEPLOYMENT.md) für `DENTAL_ENCRYPTION_ENABLED`, `DENTAL_KMS_MASTER_KEY`, SMTP, Cron.
