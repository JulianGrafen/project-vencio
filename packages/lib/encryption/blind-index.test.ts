import { describe, expect, it } from "vitest";

import { createEmailBlindIndex } from "./blind-index";
import { generateDek } from "./crypto-gcm";

describe("blind-index", () => {
  const dek = generateDek();

  it("produces stable index for normalized email", () => {
    const a = createEmailBlindIndex("Max@Example.com", dek);
    const b = createEmailBlindIndex("max@example.com", dek);
    expect(a).toBe(b);
  });

  it("produces different indexes for different emails", () => {
    const a = createEmailBlindIndex("a@example.com", dek);
    const b = createEmailBlindIndex("b@example.com", dek);
    expect(a).not.toBe(b);
  });
});
