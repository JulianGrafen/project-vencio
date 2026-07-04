import process from "node:process";

type TwilioCredentials = {
  accountSid: string;
  authToken: string;
  fromNumber: string;
};

export function resolveTwilioCredentials(config?: Partial<TwilioCredentials>): TwilioCredentials {
  const accountSid = config?.accountSid ?? process.env.TWILIO_SID ?? "";
  const authToken = config?.authToken ?? process.env.TWILIO_TOKEN ?? "";
  const fromNumber = config?.fromNumber ?? process.env.TWILIO_PHONE_NUMBER ?? "";

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error("TwilioSmsService requires TWILIO_SID, TWILIO_TOKEN, and TWILIO_PHONE_NUMBER");
  }

  return { accountSid, authToken, fromNumber };
}

export function buildTwilioBasicAuthHeader(accountSid: string, authToken: string): string {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
}
