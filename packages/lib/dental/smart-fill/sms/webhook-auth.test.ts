import { describe, expect, it, afterEach } from "vitest";

import { isSmartFillSmsMockWebhookEnabled, shouldValidateTwilioSignature } from "./webhook-auth";

describe("smart-fill webhook auth", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalMock = process.env.SMART_FILL_SMS_MOCK_WEBHOOK;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    if (originalMock === undefined) {
      delete process.env.SMART_FILL_SMS_MOCK_WEBHOOK;
    } else {
      process.env.SMART_FILL_SMS_MOCK_WEBHOOK = originalMock;
    }
  });

  it("rejects JSON mock mode in production", () => {
    process.env.NODE_ENV = "production";
    delete process.env.SMART_FILL_SMS_MOCK_WEBHOOK;

    expect(isSmartFillSmsMockWebhookEnabled()).toBe(false);
    expect(shouldValidateTwilioSignature("application/json")).toBe(true);
  });

  it("allows JSON mock mode only with explicit dev flag", () => {
    process.env.NODE_ENV = "development";
    process.env.SMART_FILL_SMS_MOCK_WEBHOOK = "true";

    expect(isSmartFillSmsMockWebhookEnabled()).toBe(true);
    expect(shouldValidateTwilioSignature("application/json")).toBe(false);
  });
});
