-- SmartFillPatient PII encryption: blind indexes for lookup + unique constraint

ALTER TABLE "SmartFillPatient" ADD COLUMN "emailBlindIndex" TEXT;
ALTER TABLE "SmartFillPatient" ADD COLUMN "phoneBlindIndex" TEXT;

-- Backfill phone lookup key from existing plaintext numbers (digits-only)
UPDATE "SmartFillPatient"
SET "phoneBlindIndex" = regexp_replace("phoneNumber", '\D', '', 'g')
WHERE "phoneBlindIndex" IS NULL;

ALTER TABLE "SmartFillPatient" ALTER COLUMN "phoneBlindIndex" SET NOT NULL;

DROP INDEX IF EXISTS "SmartFillPatient_teamId_phoneNumber_key";

CREATE UNIQUE INDEX "SmartFillPatient_teamId_phoneBlindIndex_key"
  ON "SmartFillPatient"("teamId", "phoneBlindIndex");

CREATE INDEX "SmartFillPatient_emailBlindIndex_idx"
  ON "SmartFillPatient"("emailBlindIndex");
