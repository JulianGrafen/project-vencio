import { describe, expect, it, vi, beforeEach } from "vitest";

import { SmartFillReplyHandler } from "./smart-fill-reply.handler";

describe("SmartFillReplyHandler", () => {
  const mockTransaction = vi.fn(async (fn: (tx: unknown) => Promise<void>) => {
    await fn({
      booking: { create: vi.fn(async () => ({})) },
      smartFillInvite: { update: vi.fn(async () => ({})) },
      smartFillTask: { update: vi.fn(async () => ({})) },
      smartFillPatient: { update: vi.fn(async () => ({})) },
    });
  });

  const prisma = {
    smartFillPatient: {
      findFirst: vi.fn(),
    },
    smartFillInvite: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    smartFillTask: {
      update: vi.fn(),
    },
    $transaction: mockTransaction,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("confirms booking when patient replies JA", async () => {
    prisma.smartFillPatient.findFirst.mockResolvedValue({
      id: "pat1",
      phoneNumber: "+491234567890",
    });

    prisma.smartFillInvite.findFirst.mockResolvedValue({
      id: "inv1",
      taskId: "task1",
      patient: {
        id: "pat1",
        email: "max@test.de",
        name: "Max",
        locale: "de",
      },
      task: {
        id: "task1",
        teamId: 1,
        userId: 2,
        eventTypeId: 3,
        startTime: new Date("2026-07-12T10:00:00Z"),
        endTime: new Date("2026-07-12T10:30:00Z"),
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
      expect(result.bookingUid).toBeDefined();
      expect(result.taskId).toBe("task1");
    }
    expect(mockTransaction).toHaveBeenCalled();
  });

  it("ignores unknown phone numbers", async () => {
    prisma.smartFillPatient.findFirst.mockResolvedValue(null);

    const handler = new SmartFillReplyHandler(prisma as never);
    const result = await handler.handleInboundSms({ from: "+499999", body: "JA" });

    expect(result).toEqual({ action: "ignored", reason: "unknown_patient" });
  });
});
