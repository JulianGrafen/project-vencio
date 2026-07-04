import type { SmsSendParams, SmsSendResult, SmsService } from "./sms-service.interface";
import { buildTwilioBasicAuthHeader, resolveTwilioCredentials } from "./twilio-config";

type TwilioMessagesResponse = {
  sid: string;
  status: string;
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
    const credentials = resolveTwilioCredentials(config);
    this.accountSid = credentials.accountSid;
    this.authToken = credentials.authToken;
    this.fromNumber = credentials.fromNumber;
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
          Authorization: buildTwilioBasicAuthHeader(this.accountSid, this.authToken),
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
