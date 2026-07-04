import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockDeclineByToken } = vi.hoisted(() => ({
  mockDeclineByToken: vi.fn(),
}));

vi.mock("@calcom/lib/dental/smart-fill/smart-fill-invite-action.service", () => ({
  SmartFillInviteActionService: class {
    declineByToken = mockDeclineByToken;
  },
}));

vi.mock("@calcom/prisma", () => ({ prisma: {} }));

import { createSmartFillTokenRequest } from "../../__tests__/test-helpers";
import { GET } from "../route";

describe("GET /api/smart-fill/decline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 HTML when token is missing", async () => {
    const res = await GET(createSmartFillTokenRequest("decline"));
    expect(res.status).toBe(400);
    const html = await res.text();
    expect(html).toContain("Der Link ist ungültig");
  });

  it("returns decline confirmation HTML on success", async () => {
    mockDeclineByToken.mockResolvedValue({
      success: true,
      action: "declined",
      patientName: "Anna Test",
    });

    const res = await GET(createSmartFillTokenRequest("decline", "token-decline"));
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Termin abgelehnt");
    expect(html).toContain("Anna Test");
    expect(mockDeclineByToken).toHaveBeenCalledWith("token-decline");
  });

  it("returns already-handled message when invite was processed", async () => {
    mockDeclineByToken.mockResolvedValue({ success: false, reason: "already_handled" });

    const res = await GET(createSmartFillTokenRequest("decline", "token-used"));
    const html = await res.text();
    expect(html).toContain("bereits abgelehnt");
  });
});
