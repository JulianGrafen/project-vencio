import type { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("app/api/defaultResponderForAppDir", () => ({
  defaultResponderForAppDir:
    (handler: (req: NextRequest) => Promise<Response>) =>
    (req: NextRequest) =>
      handler(req),
}));

vi.mock("@calcom/lib/dental/smart-fill", () => ({
  SmartFillReplyHandler: vi.fn(),
}));

import { POST } from "../route";

describe("POST /api/webhooks/smart-fill/sms", () => {
  const originalLegacy = process.env.SMART_FILL_SMS_LEGACY_WEBHOOK;

  afterEach(() => {
    if (originalLegacy === undefined) {
      delete process.env.SMART_FILL_SMS_LEGACY_WEBHOOK;
    } else {
      process.env.SMART_FILL_SMS_LEGACY_WEBHOOK = originalLegacy;
    }
  });

  it("returns 410 Gone when legacy SMS webhook is disabled", async () => {
    delete process.env.SMART_FILL_SMS_LEGACY_WEBHOOK;

    const res = await POST({} as NextRequest);
    expect(res.status).toBe(410);
    expect(res.headers.get("Deprecation")).toBe("true");

    const body = (await res.json()) as { error: string; migrateTo: { confirm: string } };
    expect(body.error).toBe("deprecated");
    expect(body.migrateTo.confirm).toContain("/api/smart-fill/confirm");
  });
});
