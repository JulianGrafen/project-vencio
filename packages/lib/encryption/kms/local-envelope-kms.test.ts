import { describe, expect, it } from "vitest";

import { LocalEnvelopeKeyManagementService } from "./local-envelope-kms";
import { generateDek } from "../crypto-gcm";

describe("local-envelope-kms", () => {
  const masterKey = "12345678901234567890123456789012";

  it("wraps and unwraps DEKs with tenant binding", async () => {
    process.env.DENTAL_KMS_MASTER_KEY = masterKey;
    const kms = new LocalEnvelopeKeyManagementService();
    const dek = generateDek();
    const wrapped = await kms.wrapDek(dek, 7);
    const unwrapped = await kms.unwrapDek(wrapped, 7);
    expect(unwrapped.equals(dek)).toBe(true);
  });

  it("rejects tenant mismatch on unwrap", async () => {
    process.env.DENTAL_KMS_MASTER_KEY = masterKey;
    const kms = new LocalEnvelopeKeyManagementService();
    const wrapped = await kms.wrapDek(generateDek(), 7);
    await expect(kms.unwrapDek(wrapped, 8)).rejects.toThrow(/tenant binding mismatch/);
  });
});
