import { beforeEach, describe, expect, it, vi } from "vitest";

import { SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";

import { SmartFillInviteActionService } from "./smart-fill-invite-action.service";

vi.mock("../pvs/enqueue-booking-pvs-sync", () => ({
  enqueueBookingPvsSyncIfEnabled: vi.fn(async () => ({ outboxId: "outbox-1" })),
}));

vi.mock("./smart-fill-booking-finalizer", () => ({
  finalizeSmartFillBooking: vi.fn(async () => undefined),
}));

vi.mock("./smart-fill-invite-lifecycle", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./smart-fill-invite-lifecycle")>();
  return {
    ...actual,
    declineSmartFillInvite: vi.fn(async () => undefined),
  };
});

const futureStart = new Date(Date.now() + 24 * 60 * 60 * 1000);

function buildInvite(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "inv-1",
    taskId: "task-1",
    status: SmartFillInviteStatus.SENT,
    confirmToken: "token-abc",
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
      team: { name: "Praxis Test" },
    },
    ...overrides,
  };
}

describe("SmartFillInviteActionService", () => {
  const findFirst = vi.fn();
  const updateMany = vi.fn();
  const findUnique = vi.fn();
  const update = vi.fn();
  const transaction = vi.fn(async (fn: (tx: unknown) => Promise<unknown>) =>
    fn({
      smartFillTask: { updateMany, findUnique },
      smartFillInvite: { update },
      smartFillPatient: { update: vi.fn() },
    })
  );

  const prisma = {
    smartFillInvite: { findFirst },
    $transaction: transaction,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    updateMany.mockResolvedValue({ count: 1 });
    findUnique.mockResolvedValue(null);
  });

  it("confirms invite by token and returns booking uid", async () => {
    findFirst.mockResolvedValue(buildInvite());

    const service = new SmartFillInviteActionService(prisma as never);
    const result = await service.confirmByToken("token-abc");

    expect(result).toEqual({
      success: true,
      action: "confirmed",
      bookingUid: "hold-uid-1",
      patientName: "Anna Test",
    });
    expect(transaction).toHaveBeenCalled();
  });

  it("returns invalid_token when invite not found", async () => {
    findFirst.mockResolvedValue(null);

    const service = new SmartFillInviteActionService(prisma as never);
    const result = await service.confirmByToken("missing");

    expect(result).toEqual({ success: false, reason: "invalid_token" });
  });

  it("returns expired when slot is in the past", async () => {
    findFirst.mockResolvedValue(
      buildInvite({
        task: {
          ...buildInvite().task,
          startTime: new Date("2020-01-01T10:00:00Z"),
        },
      })
    );

    const service = new SmartFillInviteActionService(prisma as never);
    const result = await service.confirmByToken("token-abc");

    expect(result).toEqual({ success: false, reason: "expired" });
  });

  it("declines invite by token", async () => {
    const { declineSmartFillInvite } = await import("./smart-fill-invite-lifecycle");
    findFirst.mockResolvedValue(buildInvite());

    const service = new SmartFillInviteActionService(prisma as never);
    const result = await service.declineByToken("token-abc");

    expect(result).toEqual({
      success: true,
      action: "declined",
      patientName: "Anna Test",
    });
    expect(declineSmartFillInvite).toHaveBeenCalled();
  });
});
