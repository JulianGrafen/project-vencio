import { describe, expect, it, vi, beforeEach } from "vitest";

import { SmartFillReplyHandler } from "./smart-fill-reply.handler";

vi.mock("@calcom/lib/dental/pvs/enqueue-booking-pvs-sync", () => ({
  enqueueBookingPvsSyncIfEnabled: vi.fn(async () => ({ outboxId: "outbox-1" })),
}));

describe("SmartFillReplyHandler", () => {
  const mockTransaction = vi.fn(async (fn: (tx: unknown) => Promise<{ bookingUid: string }>) => {
    return fn({
      booking: {
        create: vi.fn(async () => ({})),
        update: vi.fn(async () => ({})),
      },
      smartFillInvite: { update: vi.fn(async () => ({})) },
      smartFillTask: {
        update: vi.fn(async () => ({})),
        updateMany: vi.fn(async () => ({ count: 1 })),
        findUnique: vi.fn(async () => null),
      },
      smartFillPatient: { update: vi.fn(async () => ({})) },
      pvsSyncOutbox: { create: vi.fn(async () => ({ id: "outbox-1" })) },
    });
  });

  const prisma = {
    smartFillInvite: {
      findMany: vi.fn(async () => [{ task: { teamId: 1 } }]),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    smartFillTask: {
      update: vi.fn(),
    },
    booking: {
      updateMany: vi.fn(async () => ({ count: 0 })),
    },
    $transaction: mockTransaction,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("confirms booking when patient replies JA", async () => {
    prisma.smartFillInvite.findFirst.mockResolvedValue({
      id: "inv1",
      taskId: "task1",
      patient: {
        id: "pat1",
        email: "max@test.de",
        name: "Max",
        phoneNumber: "+491234567890",
        locale: "de",
      },
      task: {
        id: "task1",
        teamId: 1,
        userId: 2,
        eventTypeId: 3,
        startTime: new Date("2026-07-12T10:00:00Z"),
        endTime: new Date("2026-07-12T10:30:00Z"),
        metadata: { holdBookingUid: "hold-uid-1" },
        user: { email: "arzt@test.de", name: "Dr. Test", timeZone: "Europe/Berlin" },
        eventType: { title: "Kontrolle" },
      },
    });

    const handler = new SmartFillReplyHandler(prisma as never);
    const result = await handler.handleInboundSms({
      from: "+491234567890",
      body: "JA",
      messageSid: "SM123",
    });

    expect(result.action).toBe("confirmed");
    if (result.action === "confirmed") {
      expect(result.bookingUid).toBe("hold-uid-1");
      expect(result.taskId).toBe("task1");
    }
    expect(mockTransaction).toHaveBeenCalled();
  });

  it("ignores unknown phone numbers", async () => {
    prisma.smartFillInvite.findFirst.mockResolvedValue(null);

    const handler = new SmartFillReplyHandler(prisma as never);
    const result = await handler.handleInboundSms({ from: "+499999", body: "JA" });

    expect(result).toEqual({ action: "ignored", reason: "no_active_invite" });
  });
});
