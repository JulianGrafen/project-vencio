import { describe, expect, it } from "vitest";

import { generateDek } from "./crypto-gcm";
import { deserializeEncryptedField, isEncryptedValue, serializeEncryptedField } from "./serialize-encrypted";

describe("serialize-encrypted", () => {
  const dek = generateDek();

  it("serializes and deserializes encrypted values", () => {
    const encrypted = serializeEncryptedField("geheim", dek, 42, 1);
    expect(isEncryptedValue(encrypted)).toBe(true);
    expect(deserializeEncryptedField(encrypted, dek)).toBe("geheim");
  });
});
