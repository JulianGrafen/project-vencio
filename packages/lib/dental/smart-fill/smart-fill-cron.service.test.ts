import { describe, expect, it, vi } from "vitest";

import { SmartFillTaskStatus } from "@calcom/prisma/enums";

import { SmartFillCronService } from "./smart-fill-cron.service";

describe("SmartFillCronService invite deduplication", () => {
  it("does not send SMS when task already has invites", async () => {
    const smsSend = vi.fn();
    const prisma = {
      membership: { findMany: vi.fn(async () => []) },
      smartFillTask: {
        updateMany: vi.fn(async () => ({ count: 0 })),
      },
      smartFillInvite: {
        count: vi.fn(async () => 1),
      },
    };

    const service = new SmartFillCronService(prisma as never, { send: smsSend } as never);

    const shouldInvite = await (
      service as unknown as {
        shouldSendInvite: (id: string, status: SmartFillTaskStatus) => Promise<boolean>;
      }
    ).shouldSendInvite("task-1", SmartFillTaskStatus.PENDING);

    expect(shouldInvite).toBe(false);
    expect(smsSend).not.toHaveBeenCalled();
  });

  it("allows invite when task is pending with zero invites", async () => {
    const prisma = {
      smartFillInvite: {
        count: vi.fn(async () => 0),
      },
    };

    const service = new SmartFillCronService(prisma as never, { send: vi.fn() } as never);

    const shouldInvite = await (
      service as unknown as {
        shouldSendInvite: (id: string, status: SmartFillTaskStatus) => Promise<boolean>;
      }
    ).shouldSendInvite("task-1", SmartFillTaskStatus.PENDING);

    expect(shouldInvite).toBe(true);
  });
});
