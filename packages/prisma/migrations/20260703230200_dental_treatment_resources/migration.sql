-- Dental fork: treatment resources (chairs/rooms) for dual-availability scheduling

CREATE TYPE "TreatmentResourceType" AS ENUM ('CHAIR', 'ROOM', 'XRAY');

CREATE TABLE "TreatmentResource" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "TreatmentResourceType" NOT NULL DEFAULT 'CHAIR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "scheduleId" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentResource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BookingResource" (
    "bookingId" INTEGER NOT NULL,
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "BookingResource_pkey" PRIMARY KEY ("bookingId","resourceId")
);

CREATE UNIQUE INDEX "TreatmentResource_teamId_slug_key" ON "TreatmentResource"("teamId", "slug");
CREATE INDEX "TreatmentResource_teamId_isActive_idx" ON "TreatmentResource"("teamId", "isActive");
CREATE INDEX "BookingResource_resourceId_idx" ON "BookingResource"("resourceId");

ALTER TABLE "TreatmentResource" ADD CONSTRAINT "TreatmentResource_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TreatmentResource" ADD CONSTRAINT "TreatmentResource_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BookingResource" ADD CONSTRAINT "BookingResource_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BookingResource" ADD CONSTRAINT "BookingResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "TreatmentResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
