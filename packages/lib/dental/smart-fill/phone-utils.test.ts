import { describe, expect, it } from "vitest";

import { resolveSmartFillPatientPhone } from "./phone-utils";

describe("resolveSmartFillPatientPhone", () => {
  it("normalizes provided phone numbers", () => {
    expect(resolveSmartFillPatientPhone("+49 170 1234567", "a@test.de")).toBe("+491701234567");
  });

  it("generates stable placeholder when phone is omitted", () => {
    const first = resolveSmartFillPatientPhone("", "patient@example.com");
    const second = resolveSmartFillPatientPhone(undefined, "patient@example.com");
    expect(first).toBe(second);
    expect(first.startsWith("+499")).toBe(true);
  });
});
