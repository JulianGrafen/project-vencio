import { DENTAL_ENV, parseBooleanEnv } from "./env";
import { isDentalEncryptionEnabled } from "./feature-flags";
import { PVS_CONNECTOR_ENV } from "./pvs/pvs-outbox.constants";
import { isPvsSyncEnabled } from "./pvs/feature-flags";
import { RECALL_ENV } from "./recall/constants";
import { isRecallEnabled } from "./recall/feature-flags";
import { SMART_FILL_ENV } from "./smart-fill/constants";
import { isSmartFillEnabled } from "./smart-fill/feature-flags";
import { hasTwilioConfigured } from "./smart-fill/sms/twilio-config";

export type DentalProductionCheck = {
  id: string;
  ok: boolean;
  message: string;
};

export type DentalProductionReadiness = {
  ready: boolean;
  environment: "production" | "preview" | "development";
  complianceMode: boolean;
  checks: DentalProductionCheck[];
};

/** True when running a live production deployment (not local dev or Vercel preview). */
export function isProductionRuntime(): boolean {
  if (process.env.VERCEL_ENV === "production") {
    return true;
  }

  return process.env.NODE_ENV === "production" && process.env.CALCOM_ENV === "production";
}

export function isDentalComplianceDeployment(): boolean {
  return (
    isDentalEncryptionEnabled() ||
    parseBooleanEnv(process.env[DENTAL_ENV.NEXT_PUBLIC_COMPLIANCE_MODE])
  );
}

function hasCronSecret(): boolean {
  return Boolean(process.env.CRON_API_KEY?.trim() || process.env.CRON_SECRET?.trim());
}

function hasSmtpConfigured(): boolean {
  return Boolean(
    process.env.EMAIL_FROM?.trim() &&
      process.env.EMAIL_SERVER_HOST?.trim() &&
      process.env.EMAIL_SERVER_PORT?.trim()
  );
}

function check(id: string, ok: boolean, message: string): DentalProductionCheck {
  return { id, ok, message };
}

/**
 * Validates dental production configuration. Returns structured results for health probes.
 * Does not throw — use {@link assertDentalProductionConfig} for fail-fast startup.
 */
export function validateDentalProductionConfig(): DentalProductionReadiness {
  const checks: DentalProductionCheck[] = [];
  const complianceMode = isDentalComplianceDeployment();

  if (!isProductionRuntime()) {
    return {
      ready: true,
      environment:
        process.env.VERCEL_ENV === "preview"
          ? "preview"
          : process.env.NODE_ENV === "production"
            ? "production"
            : "development",
      complianceMode,
      checks: [check("runtime", true, "Production validation skipped outside production runtime")],
    };
  }

  if (parseBooleanEnv(process.env.DENTAL_SKIP_PRODUCTION_VALIDATION)) {
    return {
      ready: true,
      environment: "production",
      complianceMode,
      checks: [
        check(
          "skip-validation",
          true,
          "DENTAL_SKIP_PRODUCTION_VALIDATION is set — manual override (not for live EU deployments)"
        ),
      ],
    };
  }

  if (!complianceMode) {
    return {
      ready: true,
      environment: "production",
      complianceMode: false,
      checks: [check("compliance", true, "Dental compliance mode disabled — validation skipped")],
    };
  }

  if (isDentalEncryptionEnabled()) {
    checks.push(
      check(
        "kms-master-key",
        Boolean(process.env.DENTAL_KMS_MASTER_KEY?.trim()),
        "DENTAL_KMS_MASTER_KEY is required when DENTAL_ENCRYPTION_ENABLED=true"
      )
    );
  }

  checks.push(
    check(
      "cron-secret",
      hasCronSecret(),
      "CRON_API_KEY or CRON_SECRET is required for dental cron jobs (Smart-Fill, Recall)"
    )
  );

  checks.push(
    check(
      "mock-sms-webhook",
      process.env.SMART_FILL_SMS_MOCK_WEBHOOK !== "true",
      "SMART_FILL_SMS_MOCK_WEBHOOK must not be enabled in production"
    )
  );

  checks.push(
    check(
      "pvs-global-key",
      !parseBooleanEnv(process.env[PVS_CONNECTOR_ENV.ALLOW_GLOBAL_KEY]),
      "PVS_CONNECTOR_ALLOW_GLOBAL_KEY must not be set in production — use per-team credentials"
    )
  );

  if (isSmartFillEnabled()) {
    const emailProvider = process.env[SMART_FILL_ENV.EMAIL_PROVIDER] ?? "mock";
    checks.push(
      check(
        "smart-fill-email-provider",
        emailProvider === "nodemailer",
        "SMART_FILL_EMAIL_PROVIDER must be nodemailer when Smart-Fill is enabled in production"
      )
    );
    checks.push(
      check(
        "smart-fill-smtp",
        hasSmtpConfigured(),
        "EMAIL_FROM, EMAIL_SERVER_HOST, and EMAIL_SERVER_PORT are required for Smart-Fill invite emails"
      )
    );
  }

  if (isRecallEnabled()) {
    const emailProvider = process.env[RECALL_ENV.EMAIL_PROVIDER] ?? "mock";
    checks.push(
      check(
        "recall-email-provider",
        emailProvider === "nodemailer",
        "RECALL_EMAIL_PROVIDER must be nodemailer when Recall is enabled in production"
      )
    );
    checks.push(
      check(
        "smtp-config",
        hasSmtpConfigured(),
        "EMAIL_FROM, EMAIL_SERVER_HOST, and EMAIL_SERVER_PORT are required for Recall emails"
      )
    );

    if (parseBooleanEnv(process.env[RECALL_ENV.SMS_ENABLED])) {
      checks.push(
        check(
          "recall-twilio",
          hasTwilioConfigured(),
          "TWILIO_SID, TWILIO_TOKEN, and TWILIO_PHONE_NUMBER are required when RECALL_SMS_ENABLED=true"
        )
      );
    }
  }

  if (isPvsSyncEnabled()) {
    checks.push(
      check(
        "pvs-sync",
        true,
        "PVS sync enabled — configure per-team connector credentials in practice settings"
      )
    );
  }

  const ready = checks.every((item) => item.ok);

  return {
    ready,
    environment: "production",
    complianceMode,
    checks,
  };
}

/** Fail-fast startup guard for production dental deployments. */
export function assertDentalProductionConfig(): void {
  const result = validateDentalProductionConfig();
  if (result.ready) {
    return;
  }

  const failures = result.checks.filter((item) => !item.ok).map((item) => `- ${item.message}`);
  throw new Error(
    `Dental production configuration invalid:\n${failures.join("\n")}\nSee docs/dental/DEPLOYMENT.md`
  );
}

/** Blocks mock providers from running in production runtime. */
export function assertProductionProvider(provider: string, envVar: string, allowed: string[]): void {
  if (!isProductionRuntime()) {
    return;
  }

  if (provider === "mock") {
    throw new Error(
      `${envVar}=mock is not allowed in production. Set ${envVar} to one of: ${allowed.join(", ")}`
    );
  }
}
