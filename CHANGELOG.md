# Changelog

All notable changes to the dental Cal.com fork are documented here.  
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Smart-Fill AI** — cron gap scanner, patient prioritization, mock SMS, inbound webhook, dashboard KPI card.
- **Twilio SMS** — `TwilioSmsService` via `SMART_FILL_SMS_PROVIDER=twilio`
- **Slot hold** — PENDING booking blocks calendar during SMS wait
- **PVS outbox** — `PvsSyncOutbox` model + enqueue on Smart-Fill confirm
- **Smart-Fill admin** — patient pool CRUD at `/settings/smart-fill?teamId=`
- **Mandatory 2FA** for practice OWNER/ADMIN in compliance mode (`DENTAL_REQUIRE_2FA`)
- Prisma models: `SmartFillTask`, `SmartFillPatient`, `SmartFillInvite`.
- B2B landing page at `/zahnarzt` (PraxisTermin marketing).
- **GitHub Pages landing** — standalone static site in `apps/praxistermin-landing` with deploy workflow.
- **Mandatory 2FA** for practice OWNER/ADMIN in compliance mode (`DENTAL_REQUIRE_2FA`).
- PVS integration target structure documented (implementation pending in `packages/pvs-integration`).

### Added

- **PVS connector API** — `POST /api/pvs/outbox/poll` and `POST /api/pvs/outbox/ack` for local connector polling (Bearer `PVS_CONNECTOR_API_KEY`).
- **Twilio webhook validation** — Smart-Fill SMS inbound route verifies `X-Twilio-Signature` on form posts.
- **CI** — `dental-critical-path.yml` runs dental + PVS unit tests on relevant PRs.

### Changed

- **Clean Code refactor** — Smart-Fill modules split into focused services (invite lifecycle, booking finalizer, patient repository, SMS templates); deduplicated dental tRPC middleware.

### Security / Compliance

- See [COMPLIANCE.md](./COMPLIANCE.md) for encryption and DSGVO component log.

---

## [2026-07-03] — Dental encryption & treatment resources

### Added

- Field encryption layer (`packages/lib/encryption`), dental tenant context, treatment resources.
- Admin UI for treatment resource schedule assignment.
- 79 unit/integration tests across dental stack.

### Fixed

- TypeScript build blockers for Vercel deployment (blind-index fields, middleware types).
