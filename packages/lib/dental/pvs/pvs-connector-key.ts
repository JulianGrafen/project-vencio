import { createHash, randomBytes } from "node:crypto";

export function hashPvsConnectorApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}

export function generatePvsConnectorApiKey(): {
  rawKey: string;
  hashedKey: string;
  keyPrefix: string;
} {
  const rawKey = `pvs_${randomBytes(32).toString("base64url")}`;
  return {
    rawKey,
    hashedKey: hashPvsConnectorApiKey(rawKey),
    keyPrefix: rawKey.slice(0, 12),
  };
}

export function extractBearerToken(authHeader: string | null): string | undefined {
  if (!authHeader) {
    return undefined;
  }
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
}
