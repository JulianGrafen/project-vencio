import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Validates Twilio webhook requests per
 * https://www.twilio.com/docs/usage/security#validating-requests
 */
export function validateTwilioWebhookSignature(params: {
  authToken: string;
  signature: string | null | undefined;
  url: string;
  bodyParams: Record<string, string>;
}): boolean {
  const { authToken, signature, url, bodyParams } = params;

  if (!signature || !authToken) {
    return false;
  }

  const sortedKeys = Object.keys(bodyParams).sort();
  let payload = url;
  for (const key of sortedKeys) {
    payload += key + bodyParams[key];
  }

  const expected = createHmac("sha1", authToken).update(payload, "utf8").digest("base64");

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function formDataToRecord(form: FormData): Record<string, string> {
  const record: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") {
      record[key] = value;
    }
  }
  return record;
}
