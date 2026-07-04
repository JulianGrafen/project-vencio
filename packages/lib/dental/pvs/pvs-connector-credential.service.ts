import type { PrismaClient } from "@calcom/prisma";

import {
  extractBearerToken,
  generatePvsConnectorApiKey,
  hashPvsConnectorApiKey,
} from "./pvs-connector-key";
import {
  PVS_CONNECTOR_CREDENTIAL_SELECT,
  type PvsConnectorCredentialListItem,
} from "./pvs-connector-credential.select";

export class PvsConnectorCredentialService {
  constructor(private readonly prisma: PrismaClient) {}

  listByTeam(teamId: number): Promise<PvsConnectorCredentialListItem[]> {
    return this.prisma.pvsConnectorCredential.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
      select: PVS_CONNECTOR_CREDENTIAL_SELECT,
    });
  }

  async create(
    teamId: number,
    label: string
  ): Promise<{ credential: PvsConnectorCredentialListItem; rawApiKey: string }> {
    const { rawKey, hashedKey, keyPrefix } = generatePvsConnectorApiKey();

    const credential = await this.prisma.pvsConnectorCredential.create({
      data: {
        teamId,
        label,
        hashedApiKey: hashedKey,
        keyPrefix,
      },
      select: PVS_CONNECTOR_CREDENTIAL_SELECT,
    });

    return { credential, rawApiKey: rawKey };
  }

  revoke(teamId: number, credentialId: string): Promise<PvsConnectorCredentialListItem> {
    return this.prisma.pvsConnectorCredential.update({
      where: { id: credentialId, teamId },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
      select: PVS_CONNECTOR_CREDENTIAL_SELECT,
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
