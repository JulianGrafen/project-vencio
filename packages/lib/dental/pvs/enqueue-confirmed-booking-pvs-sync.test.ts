import { describe, expect, it, vi } from "vitest";

import { BookingStatus } from "@calcom/prisma/enums";

import { enqueuePvsSyncForConfirmedBooking } from "./enqueue-confirmed-booking-pvs-sync";

vi.mock("./feature-flags", () => ({
  isPvsSyncEnabled: vi.fn(() => true),
}));

vi.mock("../practice-team-resolver", () => ({
  resolveTeamIdFromEventTypeId: vi.fn(async () => 42),
}));

describe("enqueuePvsSyncForConfirmedBooking", () => {
  it("skips non-accepted bookings", async () => {
    const transaction = vi.fn();
    const prisma = { $transaction: transaction } as never;

    await enqueuePvsSyncForConfirmedBooking(prisma, {
      uid: "uid-1",
      title: "Kontrolle",
      startTime: new Date(),
      endTime: new Date(),
      status: BookingStatus.PENDING,
      eventTypeId: 3,
      attendees: [{ name: "Max", email: "max@test.de", phoneNumber: null }],
    });

    expect(transaction).not.toHaveBeenCalled();
  });

  it("enqueues create sync for accepted team booking", async () => {
    const create = vi.fn().mockResolvedValue({ id: "outbox-1" });
    const prisma = {
      eventType: { findUnique: vi.fn() },
      $transaction: vi.fn(async (fn: (tx: unknown) => Promise<unknown>) =>
        fn({
          pvsSyncOutbox: {
            findFirst: vi.fn().mockResolvedValue(null),
            create,
          },
        })
      ),
    };

    await enqueuePvsSyncForConfirmedBooking(prisma as never, {
      uid: "uid-2",
      title: "Kontrolle",
      startTime: new Date("2026-07-12T10:00:00.000Z"),
      endTime: new Date("2026-07-12T10:30:00.000Z"),
      status: BookingStatus.ACCEPTED,
      eventTypeId: 3,
      attendees: [{ name: "Anna", email: "anna@test.de", phoneNumber: "+491234567890" }],
    });

    expect(create).toHaveBeenCalled();
  });
});
