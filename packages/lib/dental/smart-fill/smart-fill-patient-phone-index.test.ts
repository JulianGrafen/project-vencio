import { describe, expect, it, vi, beforeEach } from "vitest";

import { resolveSmartFillPatientPhoneLookupKey } from "./smart-fill-patient-phone-index";

describe("smart-fill-patient-phone-index", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.DENTAL_ENCRYPTION_ENABLED;
  });

  it("normalizes phone to digits-only lookup key when encryption is disabled", () => {
    expect(resolveSmartFillPatientPhoneLookupKey("+49 170 1234567")).toBe("491701234567");
    expect(resolveSmartFillPatientPhoneLookupKey("00491701234567")).toBe("491701234567");
  });
});
