import { beforeEach, describe, expect, it, vi } from "vitest";

import { SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";

vi.mock("../pvs/enqueue-booking-pvs-sync", () => ({
  enqueueBookingPvsSyncIfEnabled: vi.fn(async () => ({ outboxId: "outbox-1" })),
}));

vi.mock("./smart-fill-booking-finalizer", () => ({
  finalizeSmartFillBooking: vi.fn(async () => undefined),
}));

import { confirmSmartFillInvite } from "./smart-fill-invite-confirm";

const futureStart = new Date(Date.now() + 24 * 60 * 60 * 1000);

function buildInvite() {
  return {
    id: "inv-1",
    taskId: "task-1",
    status: SmartFillInviteStatus.SENT,
    patient: {
      id: "pat-1",
      name: "Anna Test",
      email: "anna@test.de",
      phoneNumber: "+491701234567",
      locale: "de",
    },
    task: {
      id: "task-1",
      teamId: 1,
      userId: 2,
      eventTypeId: 3,
      status: SmartFillTaskStatus.INVITED,
      bookingUid: null,
      startTime: futureStart,
      endTime: new Date(futureStart.getTime() + 30 * 60 * 1000),
      metadata: { holdBookingUid: "hold-uid-1" },
      user: { timeZone: "Europe/Berlin" },
      eventType: { title: "Kontrolle" },
    },
  };
}

describe("confirmSmartFillInvite", () => {
  const updateMany = vi.fn();
  const findUnique = vi.fn();
  const update = vi.fn();
  const transaction = vi.fn(async (fn: (tx: unknown) => Promise<unknown>) =>
    fn({
      smartFillTask: { updateMany, findUnique },
      smartFillInvite: { update },
      smartFillPatient: { update },
    })
  );

  const prisma = { $transaction: transaction };

  beforeEach(() => {
    vi.clearAllMocks();
    updateMany.mockResolvedValue({ count: 1 });
    findUnique.mockResolvedValue(null);
  });

  it("confirms invite and returns booking uid", async () => {
    const bookingUid = await confirmSmartFillInvite(prisma as never, buildInvite() as never, "JA");

    expect(bookingUid).toBe("hold-uid-1");
    expect(transaction).toHaveBeenCalled();
    expect(updateMany).toHaveBeenCalled();
  });

  it("throws when task is no longer invitable", async () => {
    updateMany.mockResolvedValue({ count: 0 });
    findUnique.mockResolvedValue({ status: SmartFillTaskStatus.PENDING, bookingUid: null });

    await expect(
      confirmSmartFillInvite(prisma as never, buildInvite() as never, "JA")
    ).rejects.toThrow("no longer invitable");
  });
});
