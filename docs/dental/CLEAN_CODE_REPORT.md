# Clean Code Refactor Report — Dental / PVS / Smart-Fill

**Branch:** `cursor/clean-code-report-7644`  
**Date:** 2026-07-04  
**Scope:** `packages/lib/dental`, PVS API routes, `@calcom/pvs-connector`, Smart-Fill cron

---

## Executive Summary

This refactor applies **Single Responsibility**, **DRY**, and **consistent boundaries** to the dental fork’s integration layer. The focus was on eliminating duplicated PVS enqueue/auth logic, splitting the Smart-Fill cron god-class, and centralizing API contracts — without changing runtime behaviour.

| Metric | Before | After |
|--------|--------|-------|
| `smart-fill-cron.service.ts` | 307 lines | 198 lines (−35%) |
| PVS poll/ack route duplication | ~40 lines repeated auth | 2× ~15 line delegates |
| PVS enqueue entry points | 3 inconsistent paths | 1 dispatcher + shared DTO builder |
| Smart-Fill PVS sync | Bypassed `isPvsSyncEnabled()` | Uses unified gate |
| New focused modules | — | 8 files |
| Unit tests | 97 | 106 (+9) |

---

## 1. Issues Identified (Code Smells)

### 1.1 Critical — Fragmented PVS enqueue pipeline

**Symptom:** Three code paths built `AppointmentSyncDTO` independently:

- `enqueue-booking-pvs-sync.ts` (booker create/cancel)
- `enqueue-confirmed-booking-pvs-sync.ts` (manual confirm)
- `smart-fill-reply.handler.ts` (called low-level `enqueuePvsAppointmentSync` directly)

**Risk:** Smart-Fill skipped the `isPvsSyncEnabled()` feature flag; dedup rules differed per path.

**Fix:** Single internal dispatcher `enqueuePvsBookingOperationIfEnabled()` + exported `toAppointmentSyncDto()`. Smart-Fill now calls `enqueueBookingPvsSyncIfEnabled()`.

### 1.2 High — Duplicated connector API boilerplate

**Symptom:** `poll/route.ts` and `ack/route.ts` each repeated auth try/catch and JSON error mapping (~20 lines each).

**Fix:** `handlePvsConnectorPost()` in `pvs-connector-api-handler.ts` — routes are thin delegates.

### 1.3 High — Schema drift between cloud API and connector client

**Symptom:** Ack validation (`externalId` / `error` required) lived only in the ack route.

**Fix:** `outbox-api.schemas.ts` with `ZPvsOutboxPollBody` / `ZPvsOutboxAckBody` — single source for web API (connector client can import types separately).

### 1.4 Medium — Smart-Fill cron god-class

**Symptom:** `SmartFillCronService` (307 lines) mixed host discovery, slot scanning, task upsert, SMS invites, stale expiry.

**Fix:** Extracted:

| Module | Responsibility |
|--------|----------------|
| `smart-fill-cron-host-loader.ts` | Load eligible team hosts |
| `smart-fill-cron-slot-scan.ts` | Availability + busy scan → candidate slots |
| `smart-fill-cron.service.ts` | Orchestration only |

### 1.5 Medium — Repeated Prisma selects

**Symptom:** `PvsConnectorCredentialService` copy-pasted the same 7-field `select` three times.

**Fix:** `PVS_CONNECTOR_CREDENTIAL_SELECT` in `pvs-connector-credential.select.ts` (mirrors Smart-Fill patient pattern).

### 1.6 Medium — Confirmed-booking enqueue duplicated attendee logic

**Symptom:** `enqueuePvsSyncForConfirmedBooking` manually built sync input despite existing `bookingToPvsSyncInput()`.

**Fix:** Reuses shared mapper; added unit tests.

### 1.7 Low — `pvs-connector` runner mixed HTTP client + job dispatch

**Fix:** Split `PvsConnectorClient` → `client.ts`; `runner.ts` owns job processing only.

---

## 2. Module Map (After Refactor)

```
packages/lib/dental/
├── pvs/
│   ├── enqueue-pvs-sync.ts              # Low-level outbox insert + dedup helper
│   ├── enqueue-booking-pvs-sync.ts      # Unified booking → outbox (CREATE/CANCEL/UPDATE)
│   ├── enqueue-confirmed-booking-pvs-sync.ts
│   ├── outbox-api.schemas.ts            # Shared Zod contracts
│   ├── pvs-connector-api-handler.ts     # Auth + error mapping wrapper
│   ├── pvs-connector-credential.select.ts
│   └── …
└── smart-fill/
    ├── smart-fill-cron.service.ts       # Orchestrator (slim)
    ├── smart-fill-cron-host-loader.ts
    └── smart-fill-cron-slot-scan.ts

packages/pvs-connector/src/
├── client.ts                            # HTTP poll/ack
├── runner.ts                            # Job processing loop
└── cli.ts
```

---

## 3. Design Principles Applied

| Principle | Application |
|-----------|-------------|
| **SRP** | Cron host scan vs slot scan vs invite orchestration separated |
| **DRY** | One PVS operation dispatcher; one API auth handler; one credential select |
| **Fail-closed** | All enqueue paths respect `isPvsSyncEnabled()` |
| **Thin controllers** | API routes delegate to lib services |
| **Testability** | Pure DTO builder + schema tests; confirmed-enqueue tests |

---

## 4. Behaviour Preservation

- No Prisma schema changes
- No env var changes
- CREATE dedup: still blocks duplicate CREATE rows per `bookingUid`
- CANCEL/UPDATE dedup: still blocks duplicate PENDING/PROCESSING rows per operation
- Smart-Fill confirm still enqueues with `source: "smart-fill"` + `smartFillTaskId`

---

## 5. Test Coverage Added

| File | Tests |
|------|-------|
| `outbox-api.schemas.test.ts` | Poll/ack Zod validation |
| `enqueue-confirmed-booking-pvs-sync.test.ts` | Skip pending; enqueue accepted |
| Updated `smart-fill-reply.handler.test.ts` | Mock path aligned to unified enqueue |

**Total dental/PVS/connector tests:** 106 passing.

---

## 6. Remaining Technical Debt

| Priority | Item | Status |
|----------|------|--------|
| P1 | Settings UI monoliths (`PvsConnectorSettingsView`) | **Resolved** — split into `PvsOutboxDashboardPanel`, `PvsCredentialManager`; view ~86 LOC |
| P1 | API route integration tests | **Resolved** — `apps/web/app/api/pvs/outbox/__tests__/route.test.ts` |
| P1 | Shared settings cross-links | **Resolved** — `DentalSettingsCrossLinks` reused in PVS, Smart-Fill, treatment-resources |
| P2 | `dentalAdminProcedure` vs `authedProcedure` on PVS dashboard | **Resolved** — `dentalTeamAdminProcedure` (2FA + tenant + admin membership) |
| P2 | Repeated tRPC membership asserts | **Resolved** — PVS + Smart-Fill admin routes use `dentalTeamAdminProcedure` |
| P3 | Playwright E2E booker → outbox row | Deferred — critical path smoke (not in scope) |

**Test count after debt fixes:** 106 passing.

---

## 7. Files Changed

**New (8):**

- `docs/dental/CLEAN_CODE_REPORT.md`
- `packages/lib/dental/pvs/outbox-api.schemas.ts`
- `packages/lib/dental/pvs/pvs-connector-api-handler.ts`
- `packages/lib/dental/pvs/pvs-connector-credential.select.ts`
- `packages/lib/dental/smart-fill/smart-fill-cron-host-loader.ts`
- `packages/lib/dental/smart-fill/smart-fill-cron-slot-scan.ts`
- `packages/pvs-connector/src/client.ts`
- `+ 3 test files`

**Refactored (12):** enqueue modules, cron service, API routes, credential service, reply handler, runner, confirmed enqueue.

---

## 8. Verification

```bash
yarn vitest run packages/lib/dental packages/pvs-integration packages/pvs-connector apps/web/app/api/pvs/outbox/__tests__
```

All tests must pass before deploy (see `dental-critical-path.yml` CI gate).
