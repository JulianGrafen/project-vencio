import { describe, expect, it } from "vitest";

import { DampsoftBridgeStore } from "./store";

describe("DampsoftBridgeStore", () => {
  const dto = {
    bookingUid: "booking-uid-1234567890",
    teamId: 1,
    patientName: "Anna",
    patientEmail: "anna@test.de",
    startTime: "2026-07-12T10:00:00.000Z",
    endTime: "2026-07-12T10:30:00.000Z",
    title: "Kontrolle",
    source: "booker" as const,
  };

  it("creates and cancels appointments", () => {
    const store = new DampsoftBridgeStore();
    const created = store.create(dto);

    expect(created.externalId.startsWith("ds-booking-uid")).toBe(true);

    const cancelled = store.cancel(created.externalId, "Patient abgesagt");
    expect(cancelled?.cancelledAt).toBeInstanceOf(Date);
    expect(store.cancel(created.externalId)).toBeNull();
  });
});
