-- Per-practice PVS connector API credentials (hashed at rest)

CREATE TABLE "PvsConnectorCredential" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'default',
    "hashedApiKey" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PvsConnectorCredential_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PvsConnectorCredential_hashedApiKey_key" ON "PvsConnectorCredential"("hashedApiKey");
CREATE INDEX "PvsConnectorCredential_teamId_isActive_idx" ON "PvsConnectorCredential"("teamId", "isActive");

ALTER TABLE "PvsConnectorCredential" ADD CONSTRAINT "PvsConnectorCredential_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
