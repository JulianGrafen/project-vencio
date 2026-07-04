-- Medical Booking Flow: insurance triage + treatment categories (EPIC 1)

CREATE TYPE "InsuranceType" AS ENUM ('GESETZLICH', 'PRIVAT', 'SELBSTZAHLER');
CREATE TYPE "MedicalCategory" AS ENUM (
  'PROPHYLAXE',
  'SCHMERZBEHANDLUNG',
  'KONTROLLE',
  'FUELLUNG',
  'IMPLANTOLOGIE',
  'KIEFERORTHOPAEDIE',
  'SONSTIGES'
);

-- P2 contract data (not Art. 9 health data) — deliberately unencrypted for aggregation.
ALTER TABLE "Booking" ADD COLUMN "insuranceType" "InsuranceType";

CREATE INDEX "Booking_eventTypeId_insuranceType_idx" ON "Booking"("eventTypeId", "insuranceType");

CREATE TABLE "EventTypeMedicalProfile" (
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

CREATE UNIQUE INDEX "EventTypeMedicalProfile_eventTypeId_key" ON "EventTypeMedicalProfile"("eventTypeId");
CREATE INDEX "EventTypeMedicalProfile_category_idx" ON "EventTypeMedicalProfile"("category");

ALTER TABLE "EventTypeMedicalProfile" ADD CONSTRAINT "EventTypeMedicalProfile_eventTypeId_fkey"
  FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
