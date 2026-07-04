import { parseBooleanEnv } from "../../env";

const MOCK_WEBHOOK_ENV = "SMART_FILL_SMS_MOCK_WEBHOOK";

/** JSON body bypass is allowed only in non-production with an explicit dev flag. */
export function isSmartFillSmsMockWebhookEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return parseBooleanEnv(process.env[MOCK_WEBHOOK_ENV]);
}

export function shouldValidateTwilioSignature(contentType: string): boolean {
  if (contentType.includes("application/json")) {
    return !isSmartFillSmsMockWebhookEnabled();
  }

  return true;
}
