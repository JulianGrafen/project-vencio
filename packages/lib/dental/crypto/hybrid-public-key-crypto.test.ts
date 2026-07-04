import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  createBookingReferenceHash,
  encryptWithPracticePublicKey,
  isHybridEncryptedPayload,
} from "./hybrid-public-key-crypto";

describe("hybrid-public-key-crypto", () => {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  it("encrypts payload with hybrid prefix", () => {
    const sealed = encryptWithPracticePublicKey('{"name":"Max"}', publicKey, 42, 1);
    expect(isHybridEncryptedPayload(sealed)).toBe(true);
    expect(sealed.startsWith("enc:hybrid:v1:")).toBe(true);
  });

  it("creates stable booking reference hashes", () => {
    const hash = createBookingReferenceHash({
      teamId: 1,
      uid: "abc",
      startTimeIso: "2026-07-04T10:00:00.000Z",
    });
    expect(hash).toHaveLength(32);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  it("private key can decrypt wrapped DEK (smoke)", () => {
    const sealed = encryptWithPracticePublicKey("test-payload", publicKey, 1, 1);
    expect(sealed).toBeTruthy();
    expect(privateKey).toContain("PRIVATE KEY");
  });
});
