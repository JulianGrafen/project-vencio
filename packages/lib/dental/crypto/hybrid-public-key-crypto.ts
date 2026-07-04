import { createHash, createPublicKey, publicEncrypt, randomBytes, constants } from "node:crypto";

import { encryptAes256Gcm, packGcmPayload } from "@calcom/lib/encryption/crypto-gcm";

export const HYBRID_ENCRYPTED_PAYLOAD_PREFIX = "enc:hybrid:v1:";

export type HybridEncryptedPayload = {
  v: 1;
  alg: "RSA-OAEP-AES-256-GCM";
  teamId: number;
  keyVersion: number;
  wrappedKey: string;
  iv: string;
  ciphertext: string;
  authTag: string;
};

/**
 * Hybrid encryption: AES-256-GCM for payload, RSA-OAEP (SHA-256) wraps the DEK.
 * Only the practice private key holder can decrypt — cloud stores ciphertext only.
 */
export function encryptWithPracticePublicKey(
  plaintextUtf8: string,
  publicKeyPem: string,
  teamId: number,
  keyVersion: number
): string {
  const dek = randomBytes(32);
  const { iv, ciphertext, authTag } = encryptAes256Gcm(plaintextUtf8, dek);

  const publicKey = createPublicKey(publicKeyPem);
  const wrappedKey = publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    dek
  );

  const payload: HybridEncryptedPayload = {
    v: 1,
    alg: "RSA-OAEP-AES-256-GCM",
    teamId,
    keyVersion,
    wrappedKey: wrappedKey.toString("base64url"),
    iv: iv.toString("base64url"),
    ciphertext: ciphertext.toString("base64url"),
    authTag: authTag.toString("base64url"),
  };

  return `${HYBRID_ENCRYPTED_PAYLOAD_PREFIX}${Buffer.from(JSON.stringify(payload)).toString("base64url")}`;
}

export function isHybridEncryptedPayload(value: unknown): value is string {
  return typeof value === "string" && value.startsWith(HYBRID_ENCRYPTED_PAYLOAD_PREFIX);
}

/** Stable anonymized reference for slot correlation without storing PII in clear text. */
export function createBookingReferenceHash(parts: {
  teamId: number;
  uid: string;
  startTimeIso: string;
}): string {
  return createHash("sha256")
    .update(`${parts.teamId}:${parts.uid}:${parts.startTimeIso}`)
    .digest("hex")
    .slice(0, 32);
}
