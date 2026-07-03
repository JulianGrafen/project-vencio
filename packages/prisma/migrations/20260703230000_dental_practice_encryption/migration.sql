-- Dental fork: per-practice encryption keys and blind indexes for encrypted PII lookup

-- CreateTable
CREATE TABLE "PracticeEncryptionKey" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "keyVersion" INTEGER NOT NULL DEFAULT 1,
    "encryptedDek" TEXT NOT NULL,
    "kmsKeyId" TEXT,
    "algorithm" TEXT NOT NULL DEFAULT 'AES-256-GCM',
    "rotatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PracticeEncryptionKey_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Attendee" ADD COLUMN "emailBlindIndex" TEXT;
ALTER TABLE "Attendee" ADD COLUMN "phoneBlindIndex" TEXT;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "userPrimaryEmailBlindIndex" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PracticeEncryptionKey_teamId_key" ON "PracticeEncryptionKey"("teamId");

-- CreateIndex
CREATE INDEX "PracticeEncryptionKey_teamId_isActive_idx" ON "PracticeEncryptionKey"("teamId", "isActive");

-- CreateIndex
CREATE INDEX "Attendee_emailBlindIndex_idx" ON "Attendee"("emailBlindIndex");

-- CreateIndex
CREATE INDEX "Attendee_emailBlindIndex_bookingId_idx" ON "Attendee"("emailBlindIndex", "bookingId");

-- CreateIndex
CREATE INDEX "Booking_userPrimaryEmailBlindIndex_idx" ON "Booking"("userPrimaryEmailBlindIndex");

-- AddForeignKey
ALTER TABLE "PracticeEncryptionKey" ADD CONSTRAINT "PracticeEncryptionKey_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
