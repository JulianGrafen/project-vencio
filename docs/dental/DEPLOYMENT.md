# Dental Production Deployment Guide

**Scope:** PraxisTermin / Cal.diy dental fork — Vercel, self-hosted EU, on-prem PVS connector  
**Last updated:** 2026-07-04

---

## 1. Pre-flight checklist

Before pointing production traffic at a dental deployment:

- [ ] `yarn db-deploy` run against production database
- [ ] `DENTAL_ENCRYPTION_ENABLED=true` and `DENTAL_KMS_MASTER_KEY` set (32-byte secret)
- [ ] `CALCOM_ENV=production` set (self-hosted) or deploy to Vercel **Production** environment
- [ ] `CRON_API_KEY` or `CRON_SECRET` configured (Vercel Cron uses Bearer auth)
- [ ] Smart-Fill E-Mail: `SMART_FILL_EMAIL_PROVIDER=nodemailer` + SMTP (`EMAIL_*`)
- [ ] Recall E-Mail: `RECALL_EMAIL_PROVIDER=nodemailer` + SMTP
- [ ] **Do not set** in production: `SMART_FILL_EMAIL_PROVIDER=mock`, `RECALL_EMAIL_PROVIDER=mock`, `PVS_CONNECTOR_ALLOW_GLOBAL_KEY=true`
- [ ] Health probe returns 200: `GET /api/health/dental`

Startup validation runs automatically via `apps/web/instrumentation.ts`. Invalid production config **fails fast** with a clear error message.

---

## 2. Vercel deployment

| Setting | Value |
|---------|-------|
| Root directory | `apps/web` (recommended) or repo root (supported via root `vercel.json`) |
| Build command | `cd ../.. && yarn build` when Root Directory is `apps/web`; `yarn build` at repo root |
| Node.js | 20.x |
| Plan | Hobby (daily crons only) or Pro (full cron frequency) |

If the Vercel project was imported without a Root Directory, the repository root `vercel.json` sets `framework: nextjs` and `outputDirectory: apps/web/.next` so the build is packaged correctly. For new projects, prefer **Root Directory = `apps/web`** and use `apps/web/vercel.json` (Cal.com upstream convention).

### Required environment variables

```bash
# Core Cal.com
DATABASE_URL=
DATABASE_DIRECT_URL=
NEXTAUTH_SECRET=
CALENDSO_ENCRYPTION_KEY=
NEXT_PUBLIC_WEBAPP_URL=https://your-domain.example
NEXTAUTH_URL=https://your-domain.example/api/auth
CRON_API_KEY=                    # openssl rand -hex 32

# Dental compliance (EU healthcare)
DENTAL_ENCRYPTION_ENABLED=true
DENTAL_KMS_MASTER_KEY=           # openssl rand -base64 32
DENTAL_KMS_PROVIDER=local-envelope
NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE=true
CALCOM_ENV=production

# Smart-Fill (auto-enabled when DENTAL_ENCRYPTION_ENABLED=true)
SMART_FILL_EMAIL_PROVIDER=nodemailer
EMAIL_FROM=
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=

# PVS sync (auto-enabled when DENTAL_ENCRYPTION_ENABLED=true)
# Per-team API keys via Settings → PVS Connector — no global key in production
```

### Cron jobs (configured in `vercel.json` / `apps/web/vercel.json`)

Vercel **Hobby** allows only cron expressions that run **at most once per day**. The checked-in config uses daily schedules only:

| Path | Schedule | Purpose |
|------|----------|---------|
| `/api/cron/recall` | Daily 07:00 UTC | Prophylaxis recall emails |
| `/api/cron/smart-fill` | Daily 08:00 UTC | Scan gaps, send email invites |
| `/api/cron/calendar-subscriptions-cleanup` | Daily 03:00 UTC | Subscription cleanup |
| `/api/tasks/cleanup` | Daily 00:00 UTC | Task queue cleanup |

On **Pro**, you can add higher-frequency jobs (e.g. calendar sync every 5 minutes, smart-fill every 6 hours) — see upstream Cal.com `vercel.json` history or external schedulers (GitHub Actions, cron on a VPS).

Vercel sends `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is set; otherwise configure `CRON_API_KEY`.

---

## 3. Self-hosted EU (Hetzner / AWS Frankfurt)

```
┌─────────────────────────────────────────┐
│  App (Node 20, CALCOM_ENV=production)   │
│  ├── PostgreSQL (TLS, encryption at rest)│
│  ├── Secrets via Vault (not .env on disk)│
│  └── EU region only — no US tracking     │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  On-prem PVS Connector (Windows)       │
│  packages/pvs-connector                  │
└─────────────────────────────────────────┘
```

Set `CALCOM_ENV=production` so runtime guards and startup validation activate.

---

## 4. On-prem PVS connector

The connector polls the cloud outbox and writes appointments to the practice PVS.

### 4a. Dampsoft HTTP bridge (on-prem)

Run the local bridge before the connector when testing or when Dampsoft exposes a REST shim:

```bash
# Terminal 1 — local bridge (simulates Dampsoft REST until real DB wiring exists)
DAMPSOFT_BRIDGE_PORT=8090 \
DAMPSOFT_PVS_API_KEY=dev-bridge-secret \
yarn workspace @calcom/pvs-connector bridge

# Terminal 2 — cloud outbox poller
PVS_CLOUD_BASE_URL=https://your-app.example \
PVS_TEAM_ID=123 \
PVS_CONNECTOR_API_KEY=... \
DAMPSOFT_PVS_API_URL=http://127.0.0.1:8090 \
DAMPSOFT_PVS_API_KEY=dev-bridge-secret \
yarn workspace @calcom/pvs-connector exec node ./src/cli.ts
```

Bridge endpoints: `GET /health`, `POST /appointments`, `DELETE /appointments/:externalId`

### 4b. Connector environment

```bash
# Connector environment (on-prem)
PVS_CLOUD_BASE_URL=https://your-app.example
PVS_TEAM_ID=123
PVS_CONNECTOR_API_KEY=         # Per-team key from practice settings
PVS_POLL_INTERVAL_MS=30000
DAMPSOFT_PVS_API_URL=http://127.0.0.1:8090
DAMPSOFT_PVS_API_KEY=          # Must match bridge when auth enabled
```

Install and run from `packages/pvs-connector`:

```bash
yarn workspace @calcom/pvs-connector exec node ./src/cli.ts
```

**Production note:** Set `DAMPSOFT_PVS_API_URL` on the on-prem connector for HTTP bridge mode; otherwise the adapter runs in stub mode (safe for dev only).

| Connector env | Purpose |
|---------------|---------|
| `DAMPSOFT_PVS_API_URL` | Local Dampsoft bridge base URL (e.g. `http://127.0.0.1:8090`) |
| `DAMPSOFT_PVS_API_KEY` | Optional Bearer token for the bridge |
| `PVS_CLOUD_BASE_URL` | Cal.com cloud URL |
| `PVS_CONNECTOR_API_KEY` | Per-practice API key from Settings → PVS Connector |

---

## 5. Monitoring

### Health endpoint

```bash
curl -s https://your-domain.example/api/health/dental | jq
```

Response when ready:

```json
{
  "ready": true,
  "environment": "production",
  "complianceMode": true,
  "features": { "smartFill": true, "recall": true, "pvsSync": true },
  "checks": [{ "id": "kms-master-key", "ok": true, "message": "..." }]
}
```

Returns **503** when production checks fail — wire this into uptime monitoring.

### Logs

Structured dental logs use `createDentalLogger()` with module tags:

- `smart-fill-cron`, `smart-fill-cron-invite`
- `recall-cron`, `recall-mailer`
- `cron-smart-fill`, `cron-recall`

---

## 6. Feature flags

| Feature | Explicit env | Auto-enable |
|---------|--------------|-------------|
| Encryption / compliance | `DENTAL_ENCRYPTION_ENABLED=true` | — |
| Smart-Fill | `SMART_FILL_ENABLED=true` | When encryption enabled |
| Recall | `RECALL_ENABLED=true` | When encryption enabled |
| PVS sync | `PVS_SYNC_ENABLED=true` | When encryption enabled |

---

## 7. Security hardening (already implemented)

- Smart-Fill invite emails with one-click confirm/decline links (`/api/smart-fill/confirm`, `/api/smart-fill/decline`)
- Smart-Fill SMS webhook (`/api/webhooks/smart-fill/sms`) returns **410 Gone** — email-only since 2026-07-04; set `SMART_FILL_SMS_LEGACY_WEBHOOK=true` only for local legacy testing
- Recall opt-out: HTML escaping, uniform error responses
- Mock email providers blocked at runtime in production

See `COMPLIANCE.md` for DSGVO mapping.

---

## 8. Verification before go-live

```bash
# Unit tests (CI gate)
yarn vitest run packages/lib/dental packages/pvs-integration packages/pvs-connector \
  apps/web/app/api/pvs/outbox/__tests__ \
  packages/trpc/server/routers/viewer/bookings/get.handler.test.ts \
  packages/lib/dental/production-config.test.ts

# Code quality scan
yarn desloppify:scan

# Dental Playwright E2E (requires DB seed + web build)
yarn db-deploy && yarn db-seed && yarn workspace @calcom/web build
yarn e2e:dental

# Production config (local dry-run — set env vars first)
CALCOM_ENV=production NODE_ENV=production DENTAL_ENCRYPTION_ENABLED=true \
  node -e "require('@calcom/lib/dental/production-config').assertDentalProductionConfig()"
```

---

## 9. Known limitations / follow-up

| Item | Status |
|------|--------|
| `SmartFillPatient` PII field encryption | **Implemented** — `field-registry`, blind-index phone lookup, Prisma extension |
| Smart-Fill SMS replies | **Deprecated** — use email confirm/decline links; legacy webhook opt-in via `SMART_FILL_SMS_LEGACY_WEBHOOK=true` |
| Dampsoft PVS adapter | HTTP bridge via `DAMPSOFT_PVS_API_URL` or stub fallback |
| Playwright E2E | **Partial** — `apps/web/playwright/dental/` (Smart-Fill confirm, booker→outbox); run `yarn e2e:dental` |
| Desloppify subjective review | 20 dimensions unassessed |

---

## 10. Rollback

1. Disable crons in Vercel dashboard or remove entries from `vercel.json`
2. Set `DENTAL_ENCRYPTION_ENABLED=false` (disables dental features)
3. Revert deployment to previous Vercel release
4. Database migrations are forward-only — test rollback strategy in staging first
