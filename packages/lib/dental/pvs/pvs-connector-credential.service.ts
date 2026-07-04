import type { PrismaClient } from "@calcom/prisma";

import {
  extractBearerToken,
  generatePvsConnectorApiKey,
  hashPvsConnectorApiKey,
} from "./pvs-connector-key";

type CredentialListItem = {
  id: string;
  label: string;
  keyPrefix: string;
  isActive: boolean;
  lastUsedAt: Date | null;
  createdAt: Date;
  revokedAt: Date | null;
};

export class PvsConnectorCredentialService {
  constructor(private readonly prisma: PrismaClient) {}

  listByTeam(teamId: number): Promise<CredentialListItem[]> {
    return this.prisma.pvsConnectorCredential.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        label: true,
        keyPrefix: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        revokedAt: true,
      },
    });
  }

  async create(teamId: number, label: string): Promise<{ credential: CredentialListItem; rawApiKey: string }> {
    const { rawKey, hashedKey, keyPrefix } = generatePvsConnectorApiKey();

    const credential = await this.prisma.pvsConnectorCredential.create({
      data: {
        teamId,
        label,
        hashedApiKey: hashedKey,
        keyPrefix,
      },
      select: {
        id: true,
        label: true,
        keyPrefix: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        revokedAt: true,
      },
    });

    return { credential, rawApiKey: rawKey };
  }

  async revoke(teamId: number, credentialId: string): Promise<CredentialListItem> {
    return this.prisma.pvsConnectorCredential.update({
      where: { id: credentialId, teamId },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
      select: {
        id: true,
        label: true,
        keyPrefix: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        revokedAt: true,
      },
    });
  }

  async verifyTeamAccess(teamId: number, rawApiKey: string): Promise<boolean> {
    const hashedApiKey = hashPvsConnectorApiKey(rawApiKey);

    const credential = await this.prisma.pvsConnectorCredential.findFirst({
      where: {
        teamId,
        hashedApiKey,
        isActive: true,
        revokedAt: null,
      },
      select: { id: true },
    });

    if (!credential) {
      return false;
    }

    await this.prisma.pvsConnectorCredential.update({
      where: { id: credential.id },
      data: { lastUsedAt: new Date() },
    });

    return true;
  }
}
