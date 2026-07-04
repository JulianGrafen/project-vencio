import { describe, expect, it, vi, beforeEach } from "vitest";

import { MockPvsAdapter } from "@calcom/pvs-integration";

import { PvsConnectorClient } from "./client";
import { resetPvsCircuitBreakerForTests } from "./resilience";
import { processPvsOutboxJob, runPvsConnectorOnce } from "./runner";

beforeEach(() => {
  resetPvsCircuitBreakerForTests();
});

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

  it("uses pvsExternalId for cancel when present in payload", async () => {
    const adapter = new MockPvsAdapter();
    adapter.cancelAppointment = vi.fn(async () => undefined);
    const cancelSpy = vi.spyOn(adapter, "cancelAppointment");

    await processPvsOutboxJob(
      {
        id: "job-cancel-ext",
        teamId: 1,
        bookingUid: "uid-cancel-ext",
        operation: "CANCEL_APPOINTMENT",
        payload: {
          bookingUid: "uid-cancel-ext",
          pvsExternalId: "ds-appt-42",
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

    expect(cancelSpy).toHaveBeenCalledWith(
      { externalId: "ds-appt-42", provider: "mock" },
      undefined
    );
  });

  it("rejects invalid job payload", async () => {
    const adapter = new MockPvsAdapter();

    const result = await processPvsOutboxJob(
      {
        id: "job-bad",
        teamId: 1,
        bookingUid: "uid-bad",
        operation: "CREATE_APPOINTMENT",
        payload: {
          bookingUid: "uid-bad",
          teamId: 1,
          patientName: "Max",
          patientEmail: "",
          startTime: "",
          endTime: "",
          title: "Kontrolle",
          source: "booker",
        },
        attempts: 1,
        createdAt: new Date().toISOString(),
      },
      adapter as never
    );

    expect(result.status).toBe("FAILED");
    expect(result.error).toContain("patientEmail");
  });

  it("opens circuit breaker after repeated adapter failures", async () => {
    const adapter = new MockPvsAdapter();
    vi.spyOn(adapter, "createAppointment").mockRejectedValue(new Error("PVS unreachable"));

    const job = {
      id: "job-cb",
      teamId: 1,
      bookingUid: "uid-cb",
      operation: "CREATE_APPOINTMENT" as const,
      payload: {
        bookingUid: "uid-cb",
        teamId: 1,
        patientName: "Max",
        patientEmail: "max@test.de",
        startTime: "2026-07-12T10:00:00.000Z",
        endTime: "2026-07-12T10:30:00.000Z",
        title: "Kontrolle",
        source: "booker" as const,
      },
      attempts: 1,
      createdAt: new Date().toISOString(),
    };

    await processPvsOutboxJob(job, adapter as never);
    await processPvsOutboxJob(job, adapter as never);
    await processPvsOutboxJob(job, adapter as never);

    const blocked = await processPvsOutboxJob(job, adapter as never);
    expect(blocked.status).toBe("FAILED");
    expect(blocked.error).toBe("circuit_open");
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
