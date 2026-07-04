import { describe, expect, it, vi } from "vitest";

import { MockPvsAdapter } from "@calcom/pvs-integration";

import { PvsConnectorClient } from "./client";
import { processPvsOutboxJob, runPvsConnectorOnce } from "./runner";

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

describe("runPvsConnectorOnce", () => {
  it("polls, processes, and acks each job", async () => {
    const poll = vi.fn(async () => [
      {
        id: "job-1",
        teamId: 42,
        bookingUid: "uid-abc",
        operation: "CREATE_APPOINTMENT" as const,
        payload: {
          bookingUid: "uid-abc",
          teamId: 42,
          patientName: "Max",
          patientEmail: "max@test.de",
          startTime: "2026-07-12T10:00:00.000Z",
          endTime: "2026-07-12T10:30:00.000Z",
          title: "Kontrolle",
          source: "booker" as const,
        },
        attempts: 1,
        createdAt: new Date().toISOString(),
      },
    ]);
    const ack = vi.fn(async () => undefined);

    const client = { poll, ack } as unknown as PvsConnectorClient;
    const processed = await runPvsConnectorOnce({
      client,
      adapter: new MockPvsAdapter(),
    });

    expect(processed).toBe(1);
    expect(ack).toHaveBeenCalledWith(
      expect.objectContaining({
        teamId: 42,
        outboxId: "job-1",
        status: "COMPLETED",
      })
    );
  });
});
