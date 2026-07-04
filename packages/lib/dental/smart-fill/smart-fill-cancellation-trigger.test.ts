import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  isShortNoticeCancellation,
  triggerSmartFillForCancelledBooking,
  type CancelledBookingSlot,
} from "./smart-fill-cancellation-trigger";

vi.mock("./smart-fill-cron-invite", () => ({
  shouldSendSmartFillInvite: vi.fn(async () => true),
  invitePatientsForSmartFillTask: vi.fn(async () => 1),
}));

const NOW = new Date("2026-07-04T12:00:00Z");

function hoursFromNow(hours: number): Date {
  return new Date(NOW.getTime() + hours * 60 * 60 * 1000);
}

function buildSlot(overrides: Partial<CancelledBookingSlot> = {}): CancelledBookingSlot {
  return {
    bookingUid: "cancelled-uid",
    teamId: 7,
    userId: 11,
    eventTypeId: 42,
    startTime: hoursFromNow(4),
    endTime: hoursFromNow(5),
    ...overrides,
  };
}

function buildPrisma() {
  return {
    user: { findUnique: vi.fn(async () => ({ timeZone: "Europe/Berlin" })) },
    eventType: { findUnique: vi.fn(async () => ({ title: "Prophylaxe" })) },
    team: { findUnique: vi.fn(async () => ({ name: "Praxis Dr. Test" })) },
    smartFillTask: {
      findUnique: vi.fn(async () => null),
      create: vi.fn(async () => ({ id: "task-1", status: "PENDING" })),
    },
  };
}

describe("isShortNoticeCancellation", () => {
  it("accepts future slots within the 48h window", () => {
    expect(isShortNoticeCancellation(buildSlot(), NOW)).toBe(true);
  });

  it("rejects slots in the past", () => {
    expect(isShortNoticeCancellation(buildSlot({ startTime: hoursFromNow(-1) }), NOW)).toBe(false);
  });

  it("rejects slots starting beyond the 48h window", () => {
    expect(
      isShortNoticeCancellation(
        buildSlot({ startTime: hoursFromNow(49), endTime: hoursFromNow(50) }),
        NOW
      )
    ).toBe(false);
  });

  it("rejects slots shorter than the minimum gap", () => {
    expect(
      isShortNoticeCancellation(
        buildSlot({ startTime: hoursFromNow(4), endTime: new Date(hoursFromNow(4).getTime() + 10 * 60 * 1000) }),
        NOW
      )
    ).toBe(false);
  });
});

describe("triggerSmartFillForCancelledBooking", () => {
  beforeEach(() => {
    process.env.SMART_FILL_ENABLED = "true";
  });

  afterEach(() => {
    delete process.env.SMART_FILL_ENABLED;
    vi.clearAllMocks();
  });

  it("creates a task and invites a patient for a short-notice cancellation", async () => {
    const prisma = buildPrisma();

    const result = await triggerSmartFillForCancelledBooking(prisma as never, buildSlot(), NOW);

    expect(result).toEqual({ taskCreated: true, invitesSent: 1 });
    expect(prisma.smartFillTask.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          teamId: 7,
          userId: 11,
          scanRunId: "cancellation-cancelled-uid",
        }),
      })
    );
  });

  it("skips cancellations outside the short-notice window without touching the db", async () => {
    const prisma = buildPrisma();

    const result = await triggerSmartFillForCancelledBooking(
      prisma as never,
      buildSlot({ startTime: hoursFromNow(72), endTime: hoursFromNow(73) }),
      NOW
    );

    expect(result).toEqual({ taskCreated: false, invitesSent: 0 });
    expect(prisma.smartFillTask.create).not.toHaveBeenCalled();
  });

  it("skips entirely when the feature flag is off", async () => {
    delete process.env.SMART_FILL_ENABLED;
    const prisma = buildPrisma();

    const result = await triggerSmartFillForCancelledBooking(prisma as never, buildSlot(), NOW);

    expect(result).toEqual({ taskCreated: false, invitesSent: 0 });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("does not duplicate tasks the cron already created", async () => {
    const prisma = buildPrisma();
    prisma.smartFillTask.findUnique = vi.fn(async () => ({ id: "task-1", status: "INVITED" }));
    const { shouldSendSmartFillInvite } = await import("./smart-fill-cron-invite");
    vi.mocked(shouldSendSmartFillInvite).mockResolvedValueOnce(false);

    const result = await triggerSmartFillForCancelledBooking(prisma as never, buildSlot(), NOW);

    expect(result).toEqual({ taskCreated: false, invitesSent: 0 });
    expect(prisma.smartFillTask.create).not.toHaveBeenCalled();
  });
});
