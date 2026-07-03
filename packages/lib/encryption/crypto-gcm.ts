import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

export function assertValidDek(dek: Buffer): void {
  if (dek.length !== KEY_LENGTH) {
    throw new Error(`DEK must be ${KEY_LENGTH} bytes, received ${dek.length}`);
  }
}

export function generateDek(): Buffer {
  return crypto.randomBytes(KEY_LENGTH);
}

export function encryptAes256Gcm(plaintext: string, dek: Buffer): { iv: Buffer; ciphertext: Buffer; authTag: Buffer } {
  assertValidDek(dek);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, dek, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return { iv, ciphertext: encrypted, authTag };
}

export function decryptAes256Gcm(payload: Buffer, dek: Buffer): string {
  assertValidDek(dek);
  if (payload.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    throw new Error("Invalid encrypted payload length");
  }

  const iv = payload.subarray(0, IV_LENGTH);
  const authTag = payload.subarray(payload.length - AUTH_TAG_LENGTH);
  const ciphertext = payload.subarray(IV_LENGTH, payload.length - AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, dek, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

export function packGcmPayload(iv: Buffer, ciphertext: Buffer, authTag: Buffer): Buffer {
  return Buffer.concat([iv, ciphertext, authTag]);
}

export function assertValidMasterKey(masterKey: string): Buffer {
  const key = Buffer.from(masterKey, "latin1");
  if (key.length !== KEY_LENGTH) {
    throw new Error(`Master key must be ${KEY_LENGTH} bytes`);
  }
  return key;
}
