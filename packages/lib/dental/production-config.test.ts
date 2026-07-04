import { afterEach, describe, expect, it } from "vitest";

import {
  assertDentalProductionConfig,
  assertProductionProvider,
  isProductionRuntime,
  validateDentalProductionConfig,
} from "./production-config";

const ORIGINAL_ENV = { ...process.env };

function restoreEnv() {
  process.env = { ...ORIGINAL_ENV };
}

function setProductionDentalEnv(overrides: Record<string, string | undefined> = {}) {
  process.env.NODE_ENV = "production";
  process.env.CALCOM_ENV = "production";
  process.env.DENTAL_ENCRYPTION_ENABLED = "true";
  process.env.DENTAL_KMS_MASTER_KEY = "test-master-key-base64==";
  process.env.CRON_API_KEY = "cron-secret";
  process.env.SMART_FILL_EMAIL_PROVIDER = "nodemailer";
  process.env.RECALL_EMAIL_PROVIDER = "nodemailer";
  process.env.EMAIL_FROM = "noreply@example.com";
  process.env.EMAIL_SERVER_HOST = "smtp.example.com";
  process.env.EMAIL_SERVER_PORT = "587";
  delete process.env.DENTAL_SKIP_PRODUCTION_VALIDATION;
  delete process.env.SMART_FILL_SMS_MOCK_WEBHOOK;
  delete process.env.PVS_CONNECTOR_ALLOW_GLOBAL_KEY;

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

describe("production-config", () => {
  afterEach(() => {
    restoreEnv();
  });

  it("detects production runtime via CALCOM_ENV", () => {
    process.env.NODE_ENV = "production";
    process.env.CALCOM_ENV = "production";
    expect(isProductionRuntime()).toBe(true);
  });

  it("detects production runtime via VERCEL_ENV", () => {
    process.env.VERCEL_ENV = "production";
    expect(isProductionRuntime()).toBe(true);
  });

  it("skips validation outside production runtime", () => {
    process.env.NODE_ENV = "development";
    const result = validateDentalProductionConfig();
    expect(result.ready).toBe(true);
  });

  it("passes with complete production dental env", () => {
    setProductionDentalEnv();
    const result = validateDentalProductionConfig();
    expect(result.ready).toBe(true);
  });

  it("fails when KMS key is missing", () => {
    setProductionDentalEnv({ DENTAL_KMS_MASTER_KEY: "" });
    const result = validateDentalProductionConfig();
    expect(result.ready).toBe(false);
    expect(result.checks.some((item) => item.id === "kms-master-key" && !item.ok)).toBe(true);
  });

  it("fails when Smart-Fill uses mock email in production", () => {
    setProductionDentalEnv({ SMART_FILL_EMAIL_PROVIDER: "mock" });
    const result = validateDentalProductionConfig();
    expect(result.ready).toBe(false);
    expect(result.checks.some((item) => item.id === "smart-fill-email-provider" && !item.ok)).toBe(true);
  });

  it("fails when Recall uses mock email in production", () => {
    setProductionDentalEnv({ RECALL_EMAIL_PROVIDER: "mock" });
    const result = validateDentalProductionConfig();
    expect(result.ready).toBe(false);
    expect(result.checks.some((item) => item.id === "recall-email-provider" && !item.ok)).toBe(true);
  });

  it("fails when Recall SMS is enabled without Twilio credentials", () => {
    setProductionDentalEnv({ RECALL_SMS_ENABLED: "true", TWILIO_SID: "" });
    const result = validateDentalProductionConfig();
    expect(result.ready).toBe(false);
    expect(result.checks.some((item) => item.id === "recall-twilio" && !item.ok)).toBe(true);
  });

  it("passes when Recall SMS is enabled with Twilio credentials", () => {
    setProductionDentalEnv({
      RECALL_SMS_ENABLED: "true",
      TWILIO_SID: "ACtest",
      TWILIO_TOKEN: "secret",
      TWILIO_PHONE_NUMBER: "+491701234567",
    });
    const result = validateDentalProductionConfig();
    expect(result.checks.some((item) => item.id === "recall-twilio" && item.ok)).toBe(true);
  });

  it("assertDentalProductionConfig throws on invalid config", () => {
    setProductionDentalEnv({ CRON_API_KEY: "" });
    expect(() => assertDentalProductionConfig()).toThrow(/Dental production configuration invalid/);
  });

  it("assertProductionProvider blocks mock in production", () => {
    process.env.NODE_ENV = "production";
    process.env.CALCOM_ENV = "production";
    expect(() =>
      assertProductionProvider("mock", "SMART_FILL_EMAIL_PROVIDER", ["nodemailer"])
    ).toThrow(/not allowed in production/);
  });
});
