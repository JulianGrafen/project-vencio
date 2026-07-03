# Changelog

All notable changes to the dental Cal.com fork are documented here.  
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Smart-Fill AI** — cron gap scanner, patient prioritization, mock SMS, inbound webhook, dashboard KPI card.
- Prisma models: `SmartFillTask`, `SmartFillPatient`, `SmartFillInvite`.
- B2B landing page at `/zahnarzt` (PraxisTermin marketing).
- **GitHub Pages landing** — standalone static site in `apps/praxistermin-landing` with deploy workflow.
- **Mandatory 2FA** for practice OWNER/ADMIN in compliance mode (`DENTAL_REQUIRE_2FA`).
- PVS integration target structure documented (implementation pending in `packages/pvs-integration`).

### Changed

- Root `/` redirects unauthenticated users to `/zahnarzt` when `NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE=true`.

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
