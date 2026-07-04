import process from "node:process";

import type { PrismaClient } from "@calcom/prisma";

import { extractBearerToken } from "./pvs-connector-key";
import { PvsConnectorCredentialService } from "./pvs-connector-credential.service";
import { PVS_CONNECTOR_ENV } from "./pvs-outbox.constants";

export class PvsConnectorAuthError extends Error {
  readonly statusCode = 401;

  constructor(message = "Not authenticated") {
    super(message);
    this.name = "PvsConnectorAuthError";
  }
}

export function resolvePvsConnectorApiKey(): string | undefined {
  return process.env[PVS_CONNECTOR_ENV.API_KEY];
}

/** @deprecated Use assertPvsConnectorAuthorizedForTeam — kept for tests */
export function assertPvsConnectorAuthorized(authHeader: string | null): void {
  const expected = resolvePvsConnectorApiKey();
  if (!expected) {
    throw new PvsConnectorAuthError("PVS connector API is not configured");
  }

  const token = extractBearerToken(authHeader ?? null);
  if (!token || token !== expected) {
    throw new PvsConnectorAuthError();
  }
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
  if (globalKey && token === globalKey) {
    return;
  }

  throw new PvsConnectorAuthError();
}
