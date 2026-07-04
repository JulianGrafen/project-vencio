import { describe, expect, it, vi, beforeEach } from "vitest";

import { SmartFillTaskStatus } from "@calcom/prisma/enums";

import { shouldSendSmartFillInvite } from "./smart-fill-cron-invite";

describe("shouldSendSmartFillInvite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not send SMS when task already has invites", async () => {
    const prisma = {
      smartFillInvite: {
        count: vi.fn(async () => 1),
      },
    };

    const shouldInvite = await shouldSendSmartFillInvite(
      prisma as never,
      "task-1",
      SmartFillTaskStatus.PENDING
    );

    expect(shouldInvite).toBe(false);
  });

  it("allows invite when task is pending with zero invites", async () => {
    const prisma = {
      smartFillInvite: {
        count: vi.fn(async () => 0),
      },
    };

    const shouldInvite = await shouldSendSmartFillInvite(
      prisma as never,
      "task-1",
      SmartFillTaskStatus.PENDING
    );

    expect(shouldInvite).toBe(true);
  });
});
