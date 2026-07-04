import { describe, expect, it, vi } from "vitest";

import { enqueueBookingPvsSyncIfEnabled } from "./enqueue-booking-pvs-sync";

vi.mock("./feature-flags", () => ({
  isPvsSyncEnabled: vi.fn(() => true),
}));

describe("enqueueBookingPvsSyncIfEnabled", () => {
  it("skips when outbox row already exists for booking", async () => {
    const create = vi.fn();
    const tx = {
      pvsSyncOutbox: {
        findFirst: vi.fn().mockResolvedValue({ id: "existing" }),
        create,
      },
    };

    const result = await enqueueBookingPvsSyncIfEnabled(tx as never, {
      bookingUid: "uid-1",
      teamId: 5,
      title: "Kontrolle",
      startTime: new Date("2026-07-12T10:00:00.000Z"),
      endTime: new Date("2026-07-12T10:30:00.000Z"),
      patientName: "Max",
      patientEmail: "max@test.de",
    });

    expect(result).toBeNull();
    expect(create).not.toHaveBeenCalled();
  });

  it("creates outbox row for booker source", async () => {
    const create = vi.fn().mockResolvedValue({ id: "outbox-new" });
    const tx = {
      pvsSyncOutbox: {
        findFirst: vi.fn().mockResolvedValue(null),
        create,
      },
    };

    const result = await enqueueBookingPvsSyncIfEnabled(tx as never, {
      bookingUid: "uid-2",
      teamId: 5,
      title: "Kontrolle",
      startTime: new Date("2026-07-12T10:00:00.000Z"),
      endTime: new Date("2026-07-12T10:30:00.000Z"),
      patientName: "Anna",
      patientEmail: "anna@test.de",
      patientPhone: "+491701234567",
    });

    expect(result?.outboxId).toBe("outbox-new");
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          payload: expect.objectContaining({
            source: "booker",
            bookingUid: "uid-2",
          }),
        }),
      })
    );
  });

  it("creates cancel outbox row", async () => {
    const create = vi.fn().mockResolvedValue({ id: "outbox-cancel" });
    const findFirst = vi.fn().mockResolvedValue(null);
    const tx = {
      pvsSyncOutbox: {
        findFirst,
        create,
      },
    };

    const { enqueueBookingPvsCancelIfEnabled } = await import("./enqueue-booking-pvs-sync");

    const result = await enqueueBookingPvsCancelIfEnabled(tx as never, {
      bookingUid: "uid-cancel",
      teamId: 5,
      title: "Kontrolle",
      startTime: new Date("2026-07-12T10:00:00.000Z"),
      endTime: new Date("2026-07-12T10:30:00.000Z"),
      patientName: "Max",
      patientEmail: "max@test.de",
      cancellationReason: "Abgesagt",
    });

    expect(result?.outboxId).toBe("outbox-cancel");
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          operation: "CANCEL_APPOINTMENT",
        }),
      })
    );
  });

  it("includes pvsExternalId on cancel when CREATE sync completed", async () => {
    const create = vi.fn().mockResolvedValue({ id: "outbox-cancel-ext" });
    const findFirst = vi
      .fn()
      .mockResolvedValueOnce({ externalId: "ds-appt-99" })
      .mockResolvedValueOnce(null);
    const tx = {
      pvsSyncOutbox: {
        findFirst,
        create,
      },
    };

    const { enqueueBookingPvsCancelIfEnabled } = await import("./enqueue-booking-pvs-sync");

    await enqueueBookingPvsCancelIfEnabled(tx as never, {
      bookingUid: "uid-cancel-ext",
      teamId: 5,
      title: "Kontrolle",
      startTime: new Date("2026-07-12T10:00:00.000Z"),
      endTime: new Date("2026-07-12T10:30:00.000Z"),
      patientName: "Max",
      patientEmail: "max@test.de",
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          payload: expect.objectContaining({
            pvsExternalId: "ds-appt-99",
          }),
        }),
      })
    );
  });
});

describe("bookingToPvsSyncInput", () => {
  it("selects booker attendee by email and applies fallback phone", async () => {
    const { bookingToPvsSyncInput } = await import("./enqueue-booking-pvs-sync");

    const input = bookingToPvsSyncInput(
      5,
      {
        uid: "uid-booker",
        title: "Kontrolle",
        startTime: new Date("2026-07-12T10:00:00.000Z"),
        endTime: new Date("2026-07-12T10:30:00.000Z"),
        eventTypeId: 3,
        attendees: [
          { name: "Organizer Guest", email: "org@example.com", phoneNumber: null },
          { name: "Anna Patient", email: "anna@test.de", phoneNumber: null },
        ],
      },
      { bookerEmail: "anna@test.de", fallbackPhone: "+491701234567" }
    );

    expect(input).toMatchObject({
      patientName: "Anna Patient",
      patientEmail: "anna@test.de",
      patientPhone: "+491701234567",
    });
  });
});
