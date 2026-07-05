-- Incremental patch: EPIC 1 (medical booking) + EPIC 2 (recall conversion KPI)
-- Run in Supabase SQL Editor if Vercel build fails on @calcom/prisma migrate deploy.
-- Safe to re-run (idempotent).

-- Clear failed Prisma migration rows from a previous deploy attempt (P3009).
DELETE FROM "_prisma_migrations"
WHERE "migration_name" IN (
  '20260704130000_medical_booking_flow',
  '20260704140000_recall_conversion_tracking'
)
AND "finished_at" IS NULL;

-- === 20260704130000_medical_booking_flow ===

DO $$ BEGIN
  CREATE TYPE "InsuranceType" AS ENUM ('GESETZLICH', 'PRIVAT', 'SELBSTZAHLER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "MedicalCategory" AS ENUM (
    'PROPHYLAXE', 'SCHMERZBEHANDLUNG', 'KONTROLLE', 'FUELLUNG',
    'IMPLANTOLOGIE', 'KIEFERORTHOPAEDIE', 'SONSTIGES'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "insuranceType" "InsuranceType";

CREATE INDEX IF NOT EXISTS "Booking_eventTypeId_insuranceType_idx"
  ON "Booking"("eventTypeId", "insuranceType");

CREATE TABLE IF NOT EXISTS "EventTypeMedicalProfile" (
    "id" TEXT NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "category" "MedicalCategory" NOT NULL DEFAULT 'SONSTIGES',
    "allowedInsuranceTypes" "InsuranceType"[],
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventTypeMedicalProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "EventTypeMedicalProfile_eventTypeId_key"
  ON "EventTypeMedicalProfile"("eventTypeId");

CREATE INDEX IF NOT EXISTS "EventTypeMedicalProfile_category_idx"
  ON "EventTypeMedicalProfile"("category");

DO $$ BEGIN
  ALTER TABLE "EventTypeMedicalProfile"
    ADD CONSTRAINT "EventTypeMedicalProfile_eventTypeId_fkey"
    FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT gen_random_uuid()::text, 'fa0026092a9229e1b9342d8a98db1c587b7ff6a341cf649496b0448c75372cfc', NOW(), '20260704130000_medical_booking_flow', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260704130000_medical_booking_flow');

-- === 20260704140000_recall_conversion_tracking ===

ALTER TABLE "RecallHistory" ADD COLUMN IF NOT EXISTS "convertedBookingUid" TEXT;
ALTER TABLE "RecallHistory" ADD COLUMN IF NOT EXISTS "convertedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "RecallHistory_teamId_convertedAt_idx"
  ON "RecallHistory"("teamId", "convertedAt");

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT gen_random_uuid()::text, 'c4122d621dbc11caa544a6d3e2a22373d4a1e39fe62df9efc270f76817f624a8', NOW(), '20260704140000_recall_conversion_tracking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260704140000_recall_conversion_tracking');
