# Technical Compliance Log — Dental Cal.com Fork

> Automatisch gepflegtes Sicherheits- und Datenschutz-Register gemäß DSGVO Art. 6, Art. 9, Art. 32.
> Jede datenverarbeitende Komponente wird hier dokumentiert.

## Umgebungsvariablen (Self-Hosted EU)

| Variable | Zweck | Speicherort |
|---|---|---|
| `DENTAL_ENCRYPTION_ENABLED` | Aktiviert Feld-Verschlüsselung via Prisma Extension | Runtime `.env` |
| `DENTAL_KMS_MASTER_KEY` | Master-Key für Envelope Encryption (32 Bytes) — **niemals in DB** | Secrets Manager / Hetzner Vault |
| `DENTAL_KMS_PROVIDER` | KMS-Backend (`local-envelope`, später `aws-kms`, `vault`) | Runtime `.env` |

**Hinweis:** `CALENDSO_ENCRYPTION_KEY` bleibt ausschließlich für OAuth-Credentials/2FA — **nicht** für Patientendaten.

---

## 2026-07-03 — packages/lib/encryption/

**Maßnahme:** Zentrales Verschlüsselungs-Utility für den Dental-Fork.

| Komponente | Sicherheitsmaßnahme | DSGVO |
|---|---|---|
| `crypto-gcm.ts` | AES-256-GCM (Authenticated Encryption) statt legacy CBC | Art. 32 Abs. 1 lit. a |
| `serialize-encrypted.ts` | Einheitliches Format `enc:v1:{teamId}:{keyVersion}:{ciphertext}` mit Tenant-Binding | Art. 32 |
| `field-registry.ts` | Klassifikation P0 (Gesundheit) / P1 (PII) pro Modell/Feld | Art. 9, Art. 6 |
| `blind-index.ts` | HMAC-SHA256 Blind Index für E-Mail/Telefon-Suche ohne Klartext-Index | Art. 32, Datenminimierung |
| `health-data-guard.ts` | Blockade von Gesundheitsdaten in Freitextfeldern (DE-Keyword-Liste) | Art. 9 Abs. 1 — Verbot mit Ausnahme |
| `kms/local-envelope-kms.ts` | Envelope Encryption — DEK nie in Klartext in PostgreSQL | Art. 32 |
| `key-resolver.ts` | Pro-Praxis DEK mit 5-Min In-Memory Cache, kein Persist | Art. 32 |
| `record-crypto.ts` | Encrypt-on-write / Decrypt-on-read für registrierte Felder | Art. 32 |
| `tenant-context.ts` | AsyncLocalStorage für Tenant-Isolation | Art. 32 |

**Verschlüsselte Felder (Auszug):**

- `Attendee`: email, name, phoneNumber (+ Blind Indexes)
- `Booking`: responses, customInputs, description, metadata, smsReminderNumber, cancellationReason, …
- `BookingInternalNote`: text
- `VideoCallGuest`: email, name

---

## 2026-07-03 — packages/prisma/extensions/field-encryption.ts

**Maßnahme:** Prisma `$extends` Middleware für automatische Feld-Verschlüsselung.

- Verschlüsselt bei `create`, `update`, `upsert`, `createMany`, `updateMany`
- Entschlüsselt bei `findUnique`, `findFirst`, `findMany`, …
- Health-Data-Guard wird vor dem Schreiben auf P0-Felder angewendet
- Aktivierung nur wenn `DENTAL_ENCRYPTION_ENABLED=true`

**DSGVO:** Art. 25 (Privacy by Design), Art. 32 (Pseudonymisierung/Verschlüsselung)

---

## 2026-07-03 — packages/prisma/schema.prisma

**Maßnahme:** Schema-Erweiterungen für Schlüsselverwaltung und Blind Indexes.

| Änderung | Zweck |
|---|---|
| `PracticeEncryptionKey` | Pro-Praxis wrapped DEK — Schlüssel nie im Klartext in DB |
| `Attendee.emailBlindIndex` | Suche ohne Klartext-E-Mail-Index |
| `Attendee.phoneBlindIndex` | Suche ohne Klartext-Telefon-Index |
| `Booking.userPrimaryEmailBlindIndex` | Host-E-Mail-Lookup ohne Klartext |

**Migration:** `20260703230000_dental_practice_encryption`

---

## 2026-07-03 — packages/prisma/index.ts

**Maßnahme:** Integration der Field-Encryption Extension in den Prisma Client.

- `PracticeKeyResolver` nutzt `baseClient` (ohne Re-Encryption-Loop)
- Extension nur aktiv wenn `DENTAL_ENCRYPTION_ENABLED=true`

---

## 2026-07-03 — Iteration 2: Integration & Infrastruktur

### packages/lib/dental/compliance-config.ts
- Zentrale Compliance-Schalter (`isDentalComplianceMode`, `isDentalTrackingDisabled`)
- `sanitizeBookingTracking()` entfernt UTM-Tracking in Dental-Mode

### packages/lib/dental/run-with-dental-context.ts
- `runWithDentalPracticeContextForEventType()` für Booking-Flows

### packages/lib/encryption/kms/aws-kms.ts
- AWS KMS Provider (`DENTAL_KMS_PROVIDER=aws-kms`, `AWS_KMS_KEY_ARN`, `AWS_KMS_REGION=eu-central-1`)
- EncryptionContext mit `teamId` + `purpose` für Tenant-Binding

### packages/trpc/server/middlewares/dentalTenantContextMiddleware.ts
- tRPC Middleware für AsyncLocalStorage Tenant-Kontext

### packages/trpc/server/routers/viewer/bookings/util.ts
- Decrypt-Kontext bei Booking-Zugriff via `runWithDentalPracticeContext`

### packages/features/bookings/lib/service/RegularBookingService.ts
- Health-Data-Guard auf `notes` vor Buchungserstellung
- Tracking-Sanitisierung
- Encrypt-Kontext in `createBooking` / `rescheduleBooking`

### packages/features/bookings/lib/handleNewBooking/createBooking.ts
- Health-Data-Guard auf `additionalNotes`
- Tracking wird in Dental-Mode nicht persistiert

### packages/features/tasker/tasks/analytics/handleAnalyticsEvents.ts
- Dub/Third-Party Analytics deaktiviert in Dental-Mode

### apps/web/pages/api/book/event.ts
- Tenant-Kontext für öffentliche Buchungs-API

### Migration 20260703230100_dental_disable_booking_denormalized
- BookingDenormalized-Trigger deaktiviert (kein Klartext-PII-Duplikat)
- Tabelle geleert

---

## Umgebungsvariablen (Erweiterung)

| Variable | Zweck |
|---|---|
| `DENTAL_KMS_PROVIDER` | `local-envelope` (default) oder `aws-kms` |
| `AWS_KMS_KEY_ARN` | KMS Key ARN für AWS Provider |
| `AWS_KMS_REGION` | Default: `eu-central-1` |
| `DENTAL_DISABLE_TRACKING` | UTM-Tracking deaktivieren (auch ohne Encryption) |
| `DENTAL_DISABLE_THIRD_PARTY_ANALYTICS` | Dub/Analytics blockieren |
| `NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE` | Client-Compliance (Analytics, Fonts) |

---

## 2026-07-03 — Iteration 3: Frontend, Booking-UI, TreatmentResource

- **posthog-noop / dub-analytics-noop** — US-Analytics via Next.js Alias deaktiviert
- **layout.tsx** — System-Font statt Google Inter in Dental-Mode
- **booking-fields.ts** — Versicherungsart, Geburtsdatum, Erstpatient; Notes ausgeblendet
- **TreatmentResource + BookingResource** — Schema + Migration für Stühle/Räume
- **treatmentResources tRPC** — list/create für Praxis-Admins
- **tracking/server.ts** — UTM-Cookies blockiert

### 2026-07-03 — Debug-Fixes (Iteration 3b)

- **record-crypto.ts** — `attendees.createMany.data` wird verschlüsselt (Cal.com nutzt createMany, nicht create)
- **field-encryption.ts** — upsert/createMany Handler korrigiert
- **record-crypto.ts** — Fail-closed wenn teamId fehlt und Encryption aktiv
- **next.config.ts** — `env` vor Dental-Build-Block initialisiert (ReferenceError behoben)

---

## Offene Punkte (nächste Iterationen)

| Priorität | Maßnahme | Status |
|---|---|---|
| Hoch | Slot-Berechnung: Arzt + TreatmentResource | Geplant |
| Hoch | Booking-UI: Ressourcen-Auswahl im Booker | Geplant |
| Mittel | tRPC get-Handler: Decrypt-Kontext für Listen | Geplant |
| Niedrig | BYOK pro Praxis | Phase 2 |

---

## Infrastruktur-Empfehlung (Self-Hosted EU)

```
Hetzner/AWS Frankfurt
├── PostgreSQL (Volume Encryption at Rest, TLS)
├── Secrets: DENTAL_KMS_MASTER_KEY via Vault — nicht in .env auf Disk
├── App Server (EU-Region only)
└── Keine US-Tracking-Skripte / Google Fonts
```
