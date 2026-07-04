-- Prophylaxe Recall: settings, history audit log, patient opt-out flag

CREATE TYPE "RecallChannel" AS ENUM ('EMAIL', 'SMS');
CREATE TYPE "RecallHistoryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');

ALTER TABLE "SmartFillPatient" ADD COLUMN "recallEnabled" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "SmartFillPatient_teamId_recallEnabled_lastVisitAt_idx"
  ON "SmartFillPatient"("teamId", "recallEnabled", "lastVisitAt");

CREATE TABLE "RecallSettings" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "intervalMonths" INTEGER NOT NULL DEFAULT 6,
    "toleranceDays" INTEGER NOT NULL DEFAULT 3,
    "bookingSlug" TEXT,
    "eventTypeId" INTEGER,
    "practiceName" TEXT,
    "emailSubject" TEXT NOT NULL DEFAULT 'Zeit für Ihre Prophylaxe',
    "emailHtmlTemplate" TEXT NOT NULL,
    "emailTextTemplate" TEXT,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "smsTemplate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecallSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RecallHistory" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "patientId" TEXT NOT NULL,
    "channel" "RecallChannel" NOT NULL,
    "status" "RecallHistoryStatus" NOT NULL DEFAULT 'PENDING',
    "recallDueDate" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "optOutToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecallHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RecallSettings_teamId_key" ON "RecallSettings"("teamId");
CREATE UNIQUE INDEX "RecallHistory_optOutToken_key" ON "RecallHistory"("optOutToken");
CREATE UNIQUE INDEX "RecallHistory_patientId_recallDueDate_channel_key"
  ON "RecallHistory"("patientId", "recallDueDate", "channel");
CREATE INDEX "RecallHistory_teamId_status_recallDueDate_idx"
  ON "RecallHistory"("teamId", "status", "recallDueDate");
CREATE INDEX "RecallHistory_teamId_createdAt_idx" ON "RecallHistory"("teamId", "createdAt");

ALTER TABLE "RecallSettings" ADD CONSTRAINT "RecallSettings_teamId_fkey"
  FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecallSettings" ADD CONSTRAINT "RecallSettings_eventTypeId_fkey"
  FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RecallHistory" ADD CONSTRAINT "RecallHistory_teamId_fkey"
  FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecallHistory" ADD CONSTRAINT "RecallHistory_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "SmartFillPatient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
