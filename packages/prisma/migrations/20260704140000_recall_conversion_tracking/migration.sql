-- Recall conversion attribution: booking generated via recall link (dashboard KPI)

ALTER TABLE "RecallHistory" ADD COLUMN "convertedBookingUid" TEXT;
ALTER TABLE "RecallHistory" ADD COLUMN "convertedAt" TIMESTAMP(3);

CREATE INDEX "RecallHistory_teamId_convertedAt_idx" ON "RecallHistory"("teamId", "convertedAt");
