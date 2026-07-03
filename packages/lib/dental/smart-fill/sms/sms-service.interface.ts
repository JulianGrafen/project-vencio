/**
 * Abstraction for outbound patient messaging (SMS / WhatsApp).
 * Implementations: MockSmsService (dev), TwilioSmsService (prod, future).
 */
export interface SmsSendParams {
  to: string;
  body: string;
  teamId: number;
  metadata?: Record<string, string>;
}

export interface SmsSendResult {
  messageSid: string;
  status: "queued" | "sent" | "failed";
  provider: string;
}

export interface SmsService {
  send(params: SmsSendParams): Promise<SmsSendResult>;
}
