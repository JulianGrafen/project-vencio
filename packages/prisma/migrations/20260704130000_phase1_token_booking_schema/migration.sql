-- Phase 1: Token-Booking first-class storage, practice public keys, booking teamId denormalization

-- PracticeEncryptionKey: RSA public key for hybrid token-booking
ALTER TABLE "PracticeEncryptionKey" ADD COLUMN "bookingPublicKeyPem" TEXT;
ALTER TABLE "PracticeEncryptionKey" ADD COLUMN "publicKeyFingerprint" TEXT;
ALTER TABLE "PracticeEncryptionKey" ADD COLUMN "publicKeyRotatedAt" TIMESTAMP(3);

-- TokenBookingPayload: asymmetrically sealed Art. 9 data
CREATE TABLE "TokenBookingPayload" (
    "id" TEXT NOT NULL,
    "bookingUid" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "algorithm" TEXT NOT NULL,
    "encryptedBlob" TEXT NOT NULL,
    "referenceHash" TEXT NOT NULL,
    "sealedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenBookingPayload_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TokenBookingPayload_bookingUid_key" ON "TokenBookingPayload"("bookingUid");
CREATE INDEX "TokenBookingPayload_teamId_sealedAt_idx" ON "TokenBookingPayload"("teamId", "sealedAt");
CREATE INDEX "TokenBookingPayload_referenceHash_idx" ON "TokenBookingPayload"("referenceHash");

ALTER TABLE "TokenBookingPayload" ADD CONSTRAINT "TokenBookingPayload_bookingUid_fkey"
  FOREIGN KEY ("bookingUid") REFERENCES "Booking"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TokenBookingPayload" ADD CONSTRAINT "TokenBookingPayload_teamId_fkey"
  FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Booking: practice reference + seal flags
ALTER TABLE "Booking" ADD COLUMN "teamId" INTEGER;
ALTER TABLE "Booking" ADD COLUMN "isTokenBookingSealed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Booking" ADD COLUMN "tokenBookingKeyVersion" INTEGER;

CREATE INDEX "Booking_teamId_idx" ON "Booking"("teamId");

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_teamId_fkey"
  FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE "Booking" b
SET "teamId" = et."teamId"
FROM "EventType" et
WHERE b."eventTypeId" = et."id"
  AND et."teamId" IS NOT NULL
  AND b."teamId" IS NULL;

-- Attendee role (patient vs escort)
CREATE TYPE "AttendeeRole" AS ENUM ('PATIENT', 'ESCORT');

ALTER TABLE "Attendee" ADD COLUMN "role" "AttendeeRole" NOT NULL DEFAULT 'PATIENT';

-- SmartFillPatient extended sealed payload
ALTER TABLE "SmartFillPatient" ADD COLUMN "encryptedPayload" TEXT;
ALTER TABLE "SmartFillPatient" ADD COLUMN "payloadKeyVersion" INTEGER;

-- PVS outbox encrypted payloads
ALTER TABLE "PvsSyncOutbox" ADD COLUMN "encryptedPayload" TEXT;
ALTER TABLE "PvsSyncOutbox" ADD COLUMN "payloadVersion" INTEGER NOT NULL DEFAULT 1;

-- Migrate booking public keys from Team.metadata.dental to PracticeEncryptionKey where present
UPDATE "PracticeEncryptionKey" pek
SET
  "bookingPublicKeyPem" = t.metadata->'dental'->>'bookingPublicKeyPem',
  "publicKeyFingerprint" = LEFT(
    encode(sha256(convert_to(t.metadata->'dental'->>'bookingPublicKeyPem', 'UTF8')), 'hex'),
    32
  ),
  "publicKeyRotatedAt" = CURRENT_TIMESTAMP
FROM "Team" t
WHERE pek."teamId" = t.id
  AND t.metadata->'dental'->>'bookingPublicKeyPem' IS NOT NULL
  AND pek."bookingPublicKeyPem" IS NULL;

COMMENT ON TABLE "BookingDenormalized" IS 'teeth.al deprecated: plaintext PII duplicate — triggers disabled in dental deployments';
COMMENT ON TABLE "CalVideoSettings" IS 'teeth.al deprecated: not used in dental compliance mode';
COMMENT ON TABLE "VideoCallGuest" IS 'teeth.al deprecated: not used in dental compliance mode';
COMMENT ON TABLE "Payment" IS 'teeth.al deprecated: Stripe booking payments disabled in dental mode';
COMMENT ON TABLE "Tracking" IS 'teeth.al deprecated: UTM tracking disabled in dental mode';
