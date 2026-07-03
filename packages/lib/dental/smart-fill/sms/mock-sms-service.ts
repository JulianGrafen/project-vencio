import { randomUUID } from "node:crypto";

import { SMART_FILL_ENV } from "../constants";
import type { SmsSendParams, SmsSendResult, SmsService } from "./sms-service.interface";
import { TwilioSmsService } from "./twilio-sms-service";

/**
 * Development / staging SMS provider — logs messages instead of sending.
 * Replace with TwilioSmsService in production via factory.
 */
export class MockSmsService implements SmsService {
  async send(params: SmsSendParams): Promise<SmsSendResult> {
    const messageSid = `mock_${randomUUID()}`;

    if (process.env[SMART_FILL_ENV.MOCK_SMS_LOG] !== "false") {
      console.info("[SmartFill MockSms]", {
        to: params.to,
        teamId: params.teamId,
        body: params.body,
        messageSid,
      });
    }

    return {
      messageSid,
      status: "sent",
      provider: "mock",
    };
  }
}

export function createSmsService(): SmsService {
  const provider = process.env.SMART_FILL_SMS_PROVIDER ?? "mock";
  if (provider === "mock") {
    return new MockSmsService();
  }
  if (provider === "twilio") {
    return new TwilioSmsService();
  }
  throw new Error(`Unsupported SMART_FILL_SMS_PROVIDER: ${provider}`);
}
