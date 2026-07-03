import { packGcmPayload, encryptAes256Gcm, decryptAes256Gcm } from "./crypto-gcm";
import type { EncryptedFieldPayload } from "./types";

export const ENCRYPTED_VALUE_PREFIX = "enc:v1:";

export function isEncryptedValue(value: unknown): value is string {
  return typeof value === "string" && value.startsWith(ENCRYPTED_VALUE_PREFIX);
}

export function serializeEncryptedField(
  plaintext: string,
  dek: Buffer,
  teamId: number,
  keyVersion: number
): string {
  const { iv, ciphertext, authTag } = encryptAes256Gcm(plaintext, dek);
  const packed = packGcmPayload(iv, ciphertext, authTag);
  const payload: EncryptedFieldPayload = {
    v: 1,
    alg: "AES-256-GCM",
    teamId,
    keyVersion,
    ct: packed.toString("base64url"),
  };

  return `${ENCRYPTED_VALUE_PREFIX}${payload.teamId}:${payload.keyVersion}:${payload.ct}`;
}

export function deserializeEncryptedField(value: string, dek: Buffer): string {
  if (!isEncryptedValue(value)) {
    return value;
  }

  const withoutPrefix = value.slice(ENCRYPTED_VALUE_PREFIX.length);
  const firstColon = withoutPrefix.indexOf(":");
  const secondColon = withoutPrefix.indexOf(":", firstColon + 1);

  if (firstColon === -1 || secondColon === -1) {
    throw new Error("Malformed encrypted field value");
  }

  const teamId = Number(withoutPrefix.slice(0, firstColon));
  const keyVersion = Number(withoutPrefix.slice(firstColon + 1, secondColon));
  const ct = withoutPrefix.slice(secondColon + 1);
  const packed = Buffer.from(ct, "base64url");

  if (Number.isNaN(teamId) || Number.isNaN(keyVersion)) {
    throw new Error("Malformed encrypted field metadata");
  }

  return decryptAes256Gcm(packed, dek);
}

/** Extract practice teamId embedded in an encrypted field value (enc:v1:{teamId}:...). */
export function extractTeamIdFromEncryptedValue(value: string): number | null {
  if (!value.startsWith(ENCRYPTED_VALUE_PREFIX)) {
    return null;
  }
  const rest = value.slice(ENCRYPTED_VALUE_PREFIX.length);
  const teamIdPart = rest.split(":")[0];
  const teamId = Number(teamIdPart);
  return Number.isNaN(teamId) ? null : teamId;
}
