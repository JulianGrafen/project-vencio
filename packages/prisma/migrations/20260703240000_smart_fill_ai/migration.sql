-- Smart-Fill AI: gap detection, patient outreach, SMS confirmation

CREATE TYPE "SmartFillTaskStatus" AS ENUM (
  'PENDING',
  'INVITED',
  'CONFIRMED',
  'DECLINED',
  'EXPIRED',
  'FAILED',
  'CANCELLED'
);

CREATE TYPE "SmartFillInviteStatus" AS ENUM (
  'SENT',
  'DELIVERED',
  'REPLIED_YES',
  'REPLIED_NO',
  'EXPIRED',
  'FAILED'
);

CREATE TABLE "SmartFillPatient" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "waitlistEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastVisitAt" TIMESTAMP(3),
    "priorityScore" INTEGER NOT NULL DEFAULT 0,
    "preferredEventTypeId" INTEGER,
    "locale" TEXT DEFAULT 'de',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartFillPatient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SmartFillTask" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "eventTypeId" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "status" "SmartFillTaskStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedRevenueCents" INTEGER,
    "bookingUid" TEXT,
    "scanRunId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartFillTask_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SmartFillInvite" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "status" "SmartFillInviteStatus" NOT NULL DEFAULT 'SENT',
    "messageSid" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repliedAt" TIMESTAMP(3),
    "replyBody" TEXT,

    CONSTRAINT "SmartFillInvite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SmartFillPatient_teamId_phoneNumber_key" ON "SmartFillPatient"("teamId", "phoneNumber");
CREATE INDEX "SmartFillPatient_teamId_waitlistEnabled_lastVisitAt_idx" ON "SmartFillPatient"("teamId", "waitlistEnabled", "lastVisitAt");

CREATE UNIQUE INDEX "SmartFillTask_teamId_userId_startTime_endTime_key" ON "SmartFillTask"("teamId", "userId", "startTime", "endTime");
CREATE INDEX "SmartFillTask_teamId_status_startTime_idx" ON "SmartFillTask"("teamId", "status", "startTime");
CREATE INDEX "SmartFillTask_userId_startTime_idx" ON "SmartFillTask"("userId", "startTime");

CREATE INDEX "SmartFillInvite_taskId_idx" ON "SmartFillInvite"("taskId");
CREATE INDEX "SmartFillInvite_messageSid_idx" ON "SmartFillInvite"("messageSid");
CREATE INDEX "SmartFillInvite_patientId_status_idx" ON "SmartFillInvite"("patientId", "status");

ALTER TABLE "SmartFillPatient" ADD CONSTRAINT "SmartFillPatient_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SmartFillTask" ADD CONSTRAINT "SmartFillTask_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SmartFillTask" ADD CONSTRAINT "SmartFillTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SmartFillTask" ADD CONSTRAINT "SmartFillTask_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SmartFillInvite" ADD CONSTRAINT "SmartFillInvite_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "SmartFillTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SmartFillInvite" ADD CONSTRAINT "SmartFillInvite_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "SmartFillPatient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
