import { describe, expect, it } from "vitest";

import { parseOutboxJob, resolvePvsAppointmentRef } from "./validate-outbox-job";

describe("parseOutboxJob", () => {
  const baseJob = {
    id: "job-1",
    teamId: 1,
    bookingUid: "uid-1",
    operation: "CREATE_APPOINTMENT" as const,
    payload: {
      bookingUid: "uid-1",
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

  it("accepts valid job payload", () => {
    const result = parseOutboxJob(baseJob);
    expect(result.ok).toBe(true);
  });

  it("rejects missing patientEmail", () => {
    const result = parseOutboxJob({
      ...baseJob,
      payload: { ...baseJob.payload, patientEmail: "" },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("patientEmail");
    }
  });
});

describe("resolvePvsAppointmentRef", () => {
  it("prefers pvsExternalId over bookingUid", () => {
    expect(
      resolvePvsAppointmentRef(
        {
          bookingUid: "uid-1",
          pvsExternalId: "ds-99",
          teamId: 1,
          patientName: "Max",
          patientEmail: "max@test.de",
          startTime: "2026-07-12T10:00:00.000Z",
          endTime: "2026-07-12T10:30:00.000Z",
          title: "Kontrolle",
          source: "booker",
        },
        "dampsoft"
      )
    ).toEqual({ externalId: "ds-99", provider: "dampsoft" });
  });
});
