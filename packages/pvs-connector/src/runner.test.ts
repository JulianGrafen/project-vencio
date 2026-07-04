import { describe, expect, it, vi } from "vitest";

import { MockPvsAdapter } from "@calcom/pvs-integration";

import { processPvsOutboxJob } from "./runner";

describe("processPvsOutboxJob", () => {
  it("creates appointment for CREATE operation", async () => {
    const adapter = new MockPvsAdapter();
    const createSpy = vi.spyOn(adapter, "createAppointment");

    const result = await processPvsOutboxJob(
      {
        id: "job-1",
        teamId: 1,
        bookingUid: "uid-abc",
        operation: "CREATE_APPOINTMENT",
        payload: {
          bookingUid: "uid-abc",
          teamId: 1,
          patientName: "Max",
          patientEmail: "max@test.de",
          startTime: "2026-07-12T10:00:00.000Z",
          endTime: "2026-07-12T10:30:00.000Z",
          title: "Kontrolle",
          source: "booker",
        },
        attempts: 1,
        createdAt: new Date().toISOString(),
      },
      adapter as never
    );

    expect(result.status).toBe("COMPLETED");
    expect(createSpy).toHaveBeenCalled();
  });

  it("completes cancel operation without adapter cancel hook", async () => {
    const adapter = new MockPvsAdapter();

    const result = await processPvsOutboxJob(
      {
        id: "job-2",
        teamId: 1,
        bookingUid: "uid-cancel",
        operation: "CANCEL_APPOINTMENT",
        payload: {
          bookingUid: "uid-cancel",
          teamId: 1,
          patientName: "Max",
          patientEmail: "max@test.de",
          startTime: "2026-07-12T10:00:00.000Z",
          endTime: "2026-07-12T10:30:00.000Z",
          title: "Kontrolle",
          source: "booker",
          cancellationReason: "Patient abgesagt",
        },
        attempts: 1,
        createdAt: new Date().toISOString(),
      },
      adapter as never
    );

    expect(result.status).toBe("COMPLETED");
    expect(result.externalId).toContain("cancel-");
  });
});
