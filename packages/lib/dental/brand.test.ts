import { afterEach, describe, expect, it } from "vitest";

import { DENTAL_PRODUCT_NAME, resolveDentalBrandName } from "./brand";

const ORIGINAL_ENV = { ...process.env };

function restoreEnv() {
  process.env = { ...ORIGINAL_ENV };
}

describe("resolveDentalBrandName", () => {
  afterEach(() => {
    restoreEnv();
  });

  it("prefers NEXT_PUBLIC_APP_NAME when set", () => {
    process.env.NEXT_PUBLIC_APP_NAME = "Custom Praxis";
    delete process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE;
    expect(resolveDentalBrandName()).toBe("Custom Praxis");
  });

  it("returns teeth.al in public compliance mode", () => {
    delete process.env.NEXT_PUBLIC_APP_NAME;
    process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE = "true";
    expect(resolveDentalBrandName()).toBe(DENTAL_PRODUCT_NAME);
  });

  it("returns teeth.al when server encryption gate is enabled", () => {
    delete process.env.NEXT_PUBLIC_APP_NAME;
    delete process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE;
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
    expect(resolveDentalBrandName()).toBe(DENTAL_PRODUCT_NAME);
  });

  it("falls back to teeth.al outside compliance mode", () => {
    delete process.env.NEXT_PUBLIC_APP_NAME;
    delete process.env.NEXT_PUBLIC_DENTAL_COMPLIANCE_MODE;
    delete process.env.DENTAL_ENCRYPTION_ENABLED;
    expect(resolveDentalBrandName()).toBe("teeth.al");
  });
});
