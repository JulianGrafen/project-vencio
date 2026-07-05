import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";

import { assertValidMasterKey, decryptAes256Gcm, encryptAes256Gcm, generateDek, packGcmPayload } from "./crypto-gcm";

describe("crypto-gcm", () => {
  const dek = generateDek();

  it("encrypts and decrypts plaintext", () => {
    const plaintext = "Patient: Max Mustermann";
    const { iv, ciphertext, authTag } = encryptAes256Gcm(plaintext, dek);
    const packed = packGcmPayload(iv, ciphertext, authTag);
    expect(decryptAes256Gcm(packed, dek)).toBe(plaintext);
  });

  it("fails decryption with wrong key", () => {
    const { iv, ciphertext, authTag } = encryptAes256Gcm("secret", dek);
    const packed = packGcmPayload(iv, ciphertext, authTag);
    expect(() => decryptAes256Gcm(packed, generateDek())).toThrow();
  });
});

describe("assertValidMasterKey", () => {
  it("accepts a 32-character raw key", () => {
    const key = assertValidMasterKey("12345678901234567890123456789012");
    expect(key.length).toBe(32);
  });

  it("accepts a base64-encoded 32-byte key", () => {
    const encoded = randomBytes(32).toString("base64");
    const key = assertValidMasterKey(encoded);
    expect(key.length).toBe(32);
  });

  it("rejects keys with invalid length", () => {
    expect(() => assertValidMasterKey("too-short")).toThrow(/Master key must be 32 bytes/);
  });
});
