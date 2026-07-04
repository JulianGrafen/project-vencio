import { describe, expect, it } from "vitest";

import { createHmac } from "node:crypto";

import { validateTwilioWebhookSignature } from "./validate-twilio-webhook";

function buildTwilioSignature(
  authToken: string,
  url: string,
  params: Record<string, string>
): string {
  const sortedKeys = Object.keys(params).sort();
  let payload = url;
  for (const key of sortedKeys) {
    payload += key + params[key];
  }
  return createHmac("sha1", authToken).update(payload, "utf8").digest("base64");
}

describe("validateTwilioWebhookSignature", () => {
  const authToken = "test-auth-token";
  const url = "https://app.example.com/api/webhooks/smart-fill/sms";
  const params = {
    Body: "JA",
    From: "+491701234567",
    MessageSid: "SM123",
  };

  it("accepts a valid Twilio signature", () => {
    const signature = buildTwilioSignature(authToken, url, params);

    expect(
      validateTwilioWebhookSignature({
        authToken,
        signature,
        url,
        bodyParams: params,
      })
    ).toBe(true);
  });

  it("rejects an invalid signature", () => {
    expect(
      validateTwilioWebhookSignature({
        authToken,
        signature: "invalid",
        url,
        bodyParams: params,
      })
    ).toBe(false);
  });

  it("rejects when signature is missing", () => {
    expect(
      validateTwilioWebhookSignature({
        authToken,
        signature: null,
        url,
        bodyParams: params,
      })
    ).toBe(false);
  });
});
