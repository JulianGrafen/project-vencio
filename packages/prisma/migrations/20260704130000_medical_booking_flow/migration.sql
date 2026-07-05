-- Medical Booking Flow: insurance triage + treatment categories (EPIC 1)
-- Idempotent for Supabase SQL-editor bootstrap + Vercel migrate deploy retries.

DO $$ BEGIN
  CREATE TYPE "InsuranceType" AS ENUM ('GESETZLICH', 'PRIVAT', 'SELBSTZAHLER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "MedicalCategory" AS ENUM (
    'PROPHYLAXE',
    'SCHMERZBEHANDLUNG',
    'KONTROLLE',
    'FUELLUNG',
    'IMPLANTOLOGIE',
    'KIEFERORTHOPAEDIE',
    'SONSTIGES'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- P2 contract data (not Art. 9 health data) — deliberately unencrypted for aggregation.
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
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
