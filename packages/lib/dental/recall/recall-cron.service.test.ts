import { describe, expect, it, vi } from "vitest";

import { RecallHistoryStatus } from "@calcom/prisma/enums";

import { RecallCronService } from "./recall-cron.service";

const DUE_DATE = new Date("2026-07-04T00:00:00.000Z");

const sampleCandidate = {
  patientId: "pat-1",
  teamId: 1,
  name: "Anna",
  email: "anna@test.de",
  phoneNumber: "+49170",
  lastVisitAt: new Date("2026-01-04T00:00:00.000Z"),
  recallDueDate: DUE_DATE,
};

function createServiceWithMocks(mocks: {
  teamConfigs?: Array<{ teamId: number; intervalMonths: number; toleranceDays: number }>;
  settingsEnabled?: boolean;
  candidates?: typeof sampleCandidate[];
  candidatesError?: string;
  alreadySent?: boolean;
  sendSuccess?: boolean;
  sendStatus?: RecallHistoryStatus;
}) {
  const prisma = {
    recallSettings: {
      findMany: vi.fn(async () => mocks.teamConfigs ?? []),
    },
    team: {
      findMany: vi.fn(async () => []),
    },
  };

  const service = new RecallCronService(prisma as never);

  Object.assign(service, {
    settingsService: {
      getOrCreateForTeam: vi.fn(async () => ({
        enabled: mocks.settingsEnabled ?? true,
        intervalMonths: 6,
        toleranceDays: 3,
      })),
    },
    candidateService: {
      findDueCandidates: vi.fn(async () =>
        mocks.candidatesError
          ? { success: false as const, error: mocks.candidatesError }
          : { success: true as const, data: mocks.candidates ?? [] }
      ),
    },
    historyService: {
      hasActiveRecall: vi.fn(async () => mocks.alreadySent ?? false),
    },
    mailerService: {
      sendRecall: vi.fn(async () =>
        mocks.sendSuccess === false
          ? { success: false as const, error: "SMTP failed" }
          : {
              success: true as const,
              data: [
                {
                  historyId: "hist-1",
                  status: mocks.sendStatus ?? RecallHistoryStatus.SENT,
                  channel: "EMAIL",
                },
              ],
            }
      ),
    },
  });

  return service;
}

describe("RecallCronService", () => {
  it("returns zero counts when no teams are configured", async () => {
    const service = createServiceWithMocks({ teamConfigs: [] });
    const result = await service.run(DUE_DATE);

    expect(result).toEqual({
      teamsProcessed: 0,
      recallsSent: 0,
      recallsFailed: 0,
      skipped: 0,
      errors: [],
    });
  });

  it("skips teams with recall disabled in settings", async () => {
    const service = createServiceWithMocks({
      teamConfigs: [{ teamId: 1, intervalMonths: 6, toleranceDays: 3 }],
      settingsEnabled: false,
      candidates: [sampleCandidate],
    });

    const result = await service.run(DUE_DATE);

    expect(result.teamsProcessed).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.recallsSent).toBe(0);
  });

  it("sends recall for due candidates", async () => {
    const service = createServiceWithMocks({
      teamConfigs: [{ teamId: 1, intervalMonths: 6, toleranceDays: 3 }],
      candidates: [sampleCandidate],
    });

    const result = await service.run(DUE_DATE);

    expect(result.recallsSent).toBe(1);
    expect(result.recallsFailed).toBe(0);
    expect(result.errors).toEqual([]);
  });

  it("skips candidates with an active recall history row", async () => {
    const service = createServiceWithMocks({
      teamConfigs: [{ teamId: 1, intervalMonths: 6, toleranceDays: 3 }],
      candidates: [sampleCandidate],
      alreadySent: true,
    });

    const result = await service.run(DUE_DATE);

    expect(result.skipped).toBe(1);
    expect(result.recallsSent).toBe(0);
  });

  it("records failures when mailer returns an error", async () => {
    const service = createServiceWithMocks({
      teamConfigs: [{ teamId: 1, intervalMonths: 6, toleranceDays: 3 }],
      candidates: [sampleCandidate],
      sendSuccess: false,
    });

    const result = await service.run(DUE_DATE);

    expect(result.recallsFailed).toBe(1);
    expect(result.errors[0]).toContain("SMTP failed");
  });

  it("records candidate lookup errors per team", async () => {
    const service = createServiceWithMocks({
      teamConfigs: [{ teamId: 1, intervalMonths: 6, toleranceDays: 3 }],
      candidatesError: "database unavailable",
    });

    const result = await service.run(DUE_DATE);

    expect(result.errors[0]).toContain("team=1");
    expect(result.errors[0]).toContain("database unavailable");
  });
});
