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

## Offene Punkte (nächste Iterationen)

| Priorität | Maßnahme | Status |
|---|---|---|
| Hoch | AWS KMS / HashiCorp Vault Provider implementieren | Geplant |
| Hoch | `BookingDenormalized` Views deaktivieren oder verschlüsseln | Geplant |
| Hoch | tRPC Middleware für `tenantContextStorage` | Geplant |
| Mittel | Tracking-Modell (`Tracking`) deaktivieren | Geplant |
| Mittel | US-Analytics/Fonts/Provider entfernen | Geplant |
| Mittel | PostgreSQL TDE (Hetzner Volume / RDS) dokumentieren | Geplant |
| Niedrig | BYOK (Bring Your Own Key) pro Praxis | Phase 2 |

---

## Infrastruktur-Empfehlung (Self-Hosted EU)

```
Hetzner/AWS Frankfurt
├── PostgreSQL (Volume Encryption at Rest, TLS)
├── Secrets: DENTAL_KMS_MASTER_KEY via Vault — nicht in .env auf Disk
├── App Server (EU-Region only)
└── Keine US-Tracking-Skripte / Google Fonts
```
