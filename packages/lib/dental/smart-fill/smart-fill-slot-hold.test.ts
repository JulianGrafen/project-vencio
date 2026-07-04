import { describe, expect, it, vi } from "vitest";

import { BookingStatus } from "@calcom/prisma/enums";

import { SMART_FILL_HOLD_SOURCE } from "./constants";
import {
  createSmartFillHoldBooking,
  parseSmartFillTaskMetadata,
  releaseSmartFillHoldBooking,
} from "./smart-fill-slot-hold";

describe("smart-fill-slot-hold", () => {
  it("parses hold booking uid from task metadata", () => {
    expect(parseSmartFillTaskMetadata({ holdBookingUid: "uid-123" })).toEqual({
      holdBookingUid: "uid-123",
    });
    expect(parseSmartFillTaskMetadata(null)).toEqual({});
  });

  it("creates a pending hold booking and stores uid on task", async () => {
    const bookingCreate = vi.fn(async () => ({}));
    const taskUpdate = vi.fn(async () => ({}));

    const uid = await createSmartFillHoldBooking(
      {
        booking: { create: bookingCreate },
        smartFillTask: { update: taskUpdate },
      } as never,
      {
        taskId: "task-1",
        teamId: 1,
        userId: 2,
        eventTypeId: 3,
        title: "Kontrolle",
        startTime: new Date("2026-07-12T10:00:00Z"),
        endTime: new Date("2026-07-12T10:30:00Z"),
      }
    );

    expect(uid).toMatch(/^[0-9a-f-]{36}$/);
    expect(bookingCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: BookingStatus.PENDING,
          metadata: expect.objectContaining({ source: SMART_FILL_HOLD_SOURCE }),
        }),
      })
    );
    expect(taskUpdate).toHaveBeenCalled();
  });

  it("releases hold booking on decline or expiry", async () => {
    const bookingUpdateMany = vi.fn(async () => ({ count: 1 }));
    const taskUpdate = vi.fn(async () => ({}));

    await releaseSmartFillHoldBooking(
      {
        booking: { updateMany: bookingUpdateMany },
        smartFillTask: { update: taskUpdate },
      } as never,
      "task-1",
      { holdBookingUid: "hold-uid" }
    );

    expect(bookingUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { uid: "hold-uid", status: BookingStatus.PENDING },
        data: { status: BookingStatus.CANCELLED },
      })
    );
  });
});
