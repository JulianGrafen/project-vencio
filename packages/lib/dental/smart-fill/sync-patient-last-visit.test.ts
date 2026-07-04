import { describe, expect, it, vi } from "vitest";

import { BookingStatus } from "@calcom/prisma/enums";

import {
  shouldSyncPatientLastVisit,
  syncSmartFillPatientLastVisitFromBooking,
} from "./sync-patient-last-visit";

describe("sync-patient-last-visit", () => {
  it("accepts accepted and pending bookings for visit sync", () => {
    expect(shouldSyncPatientLastVisit(BookingStatus.ACCEPTED)).toBe(true);
    expect(shouldSyncPatientLastVisit(BookingStatus.PENDING)).toBe(true);
    expect(shouldSyncPatientLastVisit(BookingStatus.CANCELLED)).toBe(false);
  });

  it("updates lastVisitAt for matching patient by email (plaintext mode)", async () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "false";
    process.env.SMART_FILL_ENABLED = "true";

    const update = vi.fn(async () => ({}));
    const prisma = {
      smartFillPatient: {
        findMany: vi.fn(async () => [
          { id: "patient-1", email: "max@example.com" },
        ]),
        update,
      },
    };

    const synced = await syncSmartFillPatientLastVisitFromBooking(prisma as never, {
      teamId: 3,
      bookerEmail: "max@example.com",
      startTime: new Date("2026-07-04T10:00:00.000Z"),
    });

    expect(synced).toBe(true);
    expect(update).toHaveBeenCalledWith({
      where: { id: "patient-1" },
      data: { lastVisitAt: new Date("2026-07-04T10:00:00.000Z") },
    });

    delete process.env.DENTAL_ENCRYPTION_ENABLED;
    delete process.env.SMART_FILL_ENABLED;
  });
});
