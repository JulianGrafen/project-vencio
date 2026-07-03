import { describe, expect, it } from "vitest";

import { decryptAes256Gcm, encryptAes256Gcm, generateDek, packGcmPayload } from "./crypto-gcm";

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
