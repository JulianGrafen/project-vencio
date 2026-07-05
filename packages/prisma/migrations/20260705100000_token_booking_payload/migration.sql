-- Token-booking payload table and practice public key columns (idempotent)

ALTER TABLE "PracticeEncryptionKey"
  ADD COLUMN IF NOT EXISTS "bookingPublicKeyPem" TEXT,
  ADD COLUMN IF NOT EXISTS "publicKeyFingerprint" TEXT,
  ADD COLUMN IF NOT EXISTS "publicKeyRotatedAt" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "TokenBookingPayload" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "TokenBookingPayload_bookingUid_key" ON "TokenBookingPayload"("bookingUid");
CREATE INDEX IF NOT EXISTS "TokenBookingPayload_teamId_sealedAt_idx" ON "TokenBookingPayload"("teamId", "sealedAt");
CREATE INDEX IF NOT EXISTS "TokenBookingPayload_referenceHash_idx" ON "TokenBookingPayload"("referenceHash");

DO $$ BEGIN
  ALTER TABLE "TokenBookingPayload"
    ADD CONSTRAINT "TokenBookingPayload_bookingUid_fkey"
    FOREIGN KEY ("bookingUid") REFERENCES "Booking"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "TokenBookingPayload"
    ADD CONSTRAINT "TokenBookingPayload_teamId_fkey"
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
