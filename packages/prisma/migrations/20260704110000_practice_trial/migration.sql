-- Practice beta trial fields on Team (dental fork)

ALTER TABLE "Team" ADD COLUMN "trialStartedAt" TIMESTAMP(3);
ALTER TABLE "Team" ADD COLUMN "trialEndedAt" TIMESTAMP(3);
ALTER TABLE "Team" ADD COLUMN "isTrialActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Team" ADD COLUMN "trialBookingsCount" INTEGER NOT NULL DEFAULT 0;

-- Existing practices: trial clock starts from team creation
UPDATE "Team"
SET "trialStartedAt" = "createdAt"
WHERE "trialStartedAt" IS NULL AND "isTrialActive" = true;
