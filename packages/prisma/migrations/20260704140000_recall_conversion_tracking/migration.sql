-- Recall conversion attribution: booking generated via recall link (dashboard KPI)
-- Idempotent for Supabase SQL-editor bootstrap + Vercel migrate deploy retries.

ALTER TABLE "RecallHistory" ADD COLUMN IF NOT EXISTS "convertedBookingUid" TEXT;
ALTER TABLE "RecallHistory" ADD COLUMN IF NOT EXISTS "convertedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "RecallHistory_teamId_convertedAt_idx"
  ON "RecallHistory"("teamId", "convertedAt");
