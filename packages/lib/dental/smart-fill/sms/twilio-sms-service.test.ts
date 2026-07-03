import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { TwilioSmsService } from "./twilio-sms-service";

describe("TwilioSmsService", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("sends SMS via Twilio REST API", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ sid: "SM123", status: "queued" }), { status: 201 })
    );

    const service = new TwilioSmsService({
      accountSid: "AC_test",
      authToken: "secret",
      fromNumber: "+491234567890",
    });

    const result = await service.send({
      to: "+499876543210",
      body: "Test",
      teamId: 1,
    });

    expect(result.messageSid).toBe("SM123");
    expect(result.provider).toBe("twilio");
    expect(globalThis.fetch).toHaveBeenCalledOnce();
  });

  it("throws when Twilio credentials are missing", () => {
    expect(() => new TwilioSmsService({ accountSid: "", authToken: "", fromNumber: "" })).toThrow(
      /TWILIO/
    );
  });
});
