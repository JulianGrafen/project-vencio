import process from "node:process";

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

export function assertPvsConnectorAuthorized(authHeader: string | null): void {
  const expected = resolvePvsConnectorApiKey();
  if (!expected) {
    throw new PvsConnectorAuthError("PVS connector API is not configured");
  }

  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  if (!token || token !== expected) {
    throw new PvsConnectorAuthError();
  }
}
