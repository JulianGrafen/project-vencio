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
| Root directory | `apps/web` |
| Build command | `cd ../.. && yarn build` (in `vercel.json`) |
| Node.js | 20.x |
| Plan | Pro (cron + function limits) |

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

### Cron jobs (configured in `apps/web/vercel.json`)

| Path | Schedule | Purpose |
|------|----------|---------|
| `/api/cron/smart-fill` | Every 6 hours | Scan gaps, send email invites |
| `/api/cron/recall` | Daily 07:00 UTC | Prophylaxis recall emails |

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

```bash
# Connector environment (on-prem)
PVS_CLOUD_BASE_URL=https://your-app.example
PVS_TEAM_ID=123
PVS_CONNECTOR_API_KEY=         # Per-team key from practice settings
PVS_POLL_INTERVAL_MS=30000
```

Install and run from `packages/pvs-connector`:

```bash
yarn workspace @calcom/pvs-connector build
node packages/pvs-connector/dist/cli.js
```

**Production note:** The Dampsoft adapter is currently a stub. Wire a real PVS integration before relying on appointment sync in production.

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
| Dampsoft PVS adapter | Stub — real PVS I/O required for sync |
| Playwright E2E | **Partial** — `apps/web/playwright/dental/` (Smart-Fill confirm, booker→outbox); run `yarn e2e:dental` |
| Desloppify subjective review | 20 dimensions unassessed |

---

## 10. Rollback

1. Disable crons in Vercel dashboard or remove entries from `vercel.json`
2. Set `DENTAL_ENCRYPTION_ENABLED=false` (disables dental features)
3. Revert deployment to previous Vercel release
4. Database migrations are forward-only — test rollback strategy in staging first
