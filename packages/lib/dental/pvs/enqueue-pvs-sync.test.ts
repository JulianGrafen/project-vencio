import { describe, expect, it, vi } from "vitest";

import { PvsSyncOperation } from "@calcom/prisma/enums";

import { enqueuePvsAppointmentSync } from "./enqueue-pvs-sync";

describe("enqueuePvsAppointmentSync", () => {
  it("creates a PENDING outbox row in the same transaction", async () => {
    const create = vi.fn(async () => ({ id: "outbox-1" }));
    const tx = { pvsSyncOutbox: { create } };

    const result = await enqueuePvsAppointmentSync(tx as never, {
      bookingUid: "booking-uid",
      teamId: 42,
      patientName: "Max Mustermann",
      patientEmail: "max@test.de",
      startTime: "2026-07-12T10:00:00.000Z",
      endTime: "2026-07-12T10:30:00.000Z",
      title: "Kontrolle",
      source: "smart-fill",
      smartFillTaskId: "task-1",
    });

    expect(result.outboxId).toBe("outbox-1");
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          teamId: 42,
          bookingUid: "booking-uid",
          operation: PvsSyncOperation.CREATE_APPOINTMENT,
        }),
      })
    );
  });
});
