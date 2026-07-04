import process from "node:process";

import type { PrismaClient } from "@calcom/prisma";

import { extractBearerToken } from "./pvs-connector-key";
import { PvsConnectorCredentialService } from "./pvs-connector-credential.service";
import { isGlobalPvsConnectorKeyAllowed, PVS_CONNECTOR_ENV } from "./pvs-outbox.constants";

export class PvsConnectorAuthError extends Error {
  readonly statusCode = 401;

  constructor(message = "Not authenticated") {
    super(message);
    this.name = "PvsConnectorAuthError";
  }
}

export function resolvePvsConnectorApiKey(): string | undefined {
  return process.env[PVS_CONNECTOR_ENV.CONNECTOR_BEARER_ENV];
}

/**
 * Validates connector Bearer token for a specific practice.
 * Prefers per-team credentials; falls back to global PVS_CONNECTOR_API_KEY (dev/legacy).
 */
export async function assertPvsConnectorAuthorizedForTeam(
  prisma: PrismaClient,
  authHeader: string | null,
  teamId: number
): Promise<void> {
  const token = extractBearerToken(authHeader ?? null);
  if (!token) {
    throw new PvsConnectorAuthError();
  }

  const credentialService = new PvsConnectorCredentialService(prisma);
  const teamAuthorized = await credentialService.verifyTeamAccess(teamId, token);
  if (teamAuthorized) {
    return;
  }

  const globalKey = resolvePvsConnectorApiKey();
  if (isGlobalPvsConnectorKeyAllowed() && globalKey && token === globalKey) {
    return;
  }

  throw new PvsConnectorAuthError();
}
