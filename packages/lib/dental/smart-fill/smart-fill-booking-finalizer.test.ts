import { describe, expect, it, vi } from "vitest";

import { BookingStatus } from "@calcom/prisma/enums";

import { finalizeSmartFillBooking } from "./smart-fill-booking-finalizer";
import { SMART_FILL_BOOKING_SOURCE } from "./constants";

describe("finalizeSmartFillBooking", () => {
  it("upgrades an existing hold booking", async () => {
    const update = vi.fn(async () => ({}));
    const create = vi.fn(async () => ({}));

    await finalizeSmartFillBooking(
      { booking: { update, create } } as never,
      {
        bookingUid: "new-uid",
        holdBookingUid: "hold-uid",
        task: {
          id: "task-1",
          teamId: 1,
          userId: 2,
          eventTypeId: 3,
          startTime: new Date("2026-07-12T10:00:00Z"),
          endTime: new Date("2026-07-12T10:30:00Z"),
          eventTypeTitle: "Kontrolle",
        },
        patient: {
          email: "max@test.de",
          name: "Max",
          timeZone: "Europe/Berlin",
          locale: "de",
        },
      }
    );

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { uid: "hold-uid" },
        data: expect.objectContaining({
          status: BookingStatus.ACCEPTED,
          metadata: expect.objectContaining({ source: SMART_FILL_BOOKING_SOURCE }),
        }),
      })
    );
    expect(create).not.toHaveBeenCalled();
  });

  it("creates a booking when no hold exists", async () => {
    const update = vi.fn(async () => ({}));
    const create = vi.fn(async () => ({}));

    await finalizeSmartFillBooking(
      { booking: { update, create } } as never,
      {
        bookingUid: "booking-uid",
        task: {
          id: "task-1",
          teamId: 1,
          userId: 2,
          eventTypeId: 3,
          startTime: new Date("2026-07-12T10:00:00Z"),
          endTime: new Date("2026-07-12T10:30:00Z"),
        },
        patient: {
          email: "max@test.de",
          name: "Max",
          timeZone: "Europe/Berlin",
          locale: "de",
        },
      }
    );

    expect(create).toHaveBeenCalledOnce();
    expect(update).not.toHaveBeenCalled();
  });
});
