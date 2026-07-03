import type { SmsSendParams, SmsSendResult, SmsService } from "./sms-service.interface";

type TwilioMessagesResponse = {
  sid: string;
  status: string;
  error_code?: number | null;
  error_message?: string | null;
};

/**
 * Production SMS provider using Twilio REST API (fetch-based, no SDK).
 */
export class TwilioSmsService implements SmsService {
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly fromNumber: string;

  constructor(config?: { accountSid?: string; authToken?: string; fromNumber?: string }) {
    this.accountSid = config?.accountSid ?? process.env.TWILIO_SID ?? "";
    this.authToken = config?.authToken ?? process.env.TWILIO_TOKEN ?? "";
    this.fromNumber = config?.fromNumber ?? process.env.TWILIO_PHONE_NUMBER ?? "";

    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      throw new Error("TwilioSmsService requires TWILIO_SID, TWILIO_TOKEN, and TWILIO_PHONE_NUMBER");
    }
  }

  async send(params: SmsSendParams): Promise<SmsSendResult> {
    const body = new URLSearchParams({
      To: params.to,
      From: this.fromNumber,
      Body: params.body,
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    const payload = (await response.json()) as TwilioMessagesResponse;

    if (!response.ok) {
      throw new Error(payload.error_message ?? `Twilio API error (${response.status})`);
    }

    return {
      messageSid: payload.sid,
      status: payload.status === "failed" ? "failed" : "queued",
      provider: "twilio",
    };
  }
}
