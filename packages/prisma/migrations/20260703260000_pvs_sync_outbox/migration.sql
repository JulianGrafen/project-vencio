-- PVS Sync Outbox for async appointment export to practice management systems

CREATE TYPE "PvsSyncOutboxStatus" AS ENUM (
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED'
);

CREATE TYPE "PvsSyncOperation" AS ENUM (
  'CREATE_APPOINTMENT',
  'UPDATE_APPOINTMENT',
  'CANCEL_APPOINTMENT'
);

CREATE TABLE "PvsSyncOutbox" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "bookingUid" TEXT NOT NULL,
    "operation" "PvsSyncOperation" NOT NULL DEFAULT 'CREATE_APPOINTMENT',
    "payload" JSONB NOT NULL,
    "status" "PvsSyncOutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "externalId" TEXT,
    "nextRetryAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PvsSyncOutbox_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PvsSyncOutbox_status_nextRetryAt_idx" ON "PvsSyncOutbox"("status", "nextRetryAt");
CREATE INDEX "PvsSyncOutbox_teamId_bookingUid_idx" ON "PvsSyncOutbox"("teamId", "bookingUid");

ALTER TABLE "PvsSyncOutbox" ADD CONSTRAINT "PvsSyncOutbox_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
