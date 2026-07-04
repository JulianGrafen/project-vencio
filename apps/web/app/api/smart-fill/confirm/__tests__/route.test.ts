import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockConfirmByToken } = vi.hoisted(() => ({
  mockConfirmByToken: vi.fn(),
}));

vi.mock("@calcom/lib/dental/smart-fill/smart-fill-invite-action.service", () => ({
  SmartFillInviteActionService: class {
    confirmByToken = mockConfirmByToken;
  },
}));

vi.mock("@calcom/prisma", () => ({ prisma: {} }));

import { createSmartFillTokenRequest } from "../../__tests__/test-helpers";
import { GET } from "../route";

describe("GET /api/smart-fill/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 HTML when token is missing", async () => {
    const res = await GET(createSmartFillTokenRequest("confirm"));
    expect(res.status).toBe(400);
    const html = await res.text();
    expect(html).toContain("Der Link ist ungültig");
  });

  it("returns confirmation HTML on success", async () => {
    mockConfirmByToken.mockResolvedValue({
      success: true,
      action: "confirmed",
      bookingUid: "hold-1",
      patientName: "Anna Test",
    });

    const res = await GET(createSmartFillTokenRequest("confirm", "token-abc"));
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Termin bestätigt");
    expect(html).toContain("Anna Test");
    expect(mockConfirmByToken).toHaveBeenCalledWith("token-abc");
  });

  it("returns expired message when slot is no longer available", async () => {
    mockConfirmByToken.mockResolvedValue({ success: false, reason: "expired" });

    const res = await GET(createSmartFillTokenRequest("confirm", "token-expired"));
    const html = await res.text();
    expect(html).toContain("nicht mehr verfügbar");
  });

  it("escapes patient name in HTML output", async () => {
    mockConfirmByToken.mockResolvedValue({
      success: true,
      action: "confirmed",
      bookingUid: "hold-1",
      patientName: '<script>alert("xss")</script>',
    });

    const res = await GET(createSmartFillTokenRequest("confirm", "token-xss"));
    const html = await res.text();
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
