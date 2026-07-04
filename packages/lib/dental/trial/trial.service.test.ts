import { afterEach, describe, expect, it, vi } from "vitest";

import { checkTrialEligibility } from "./trial-eligibility";
import { PracticeTrialService } from "./trial.service";

describe("PracticeTrialService", () => {
  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.DENTAL_ENCRYPTION_ENABLED;
    delete process.env.PRACTICE_TRIAL_ENABLED;
  });

  it("increments trialBookingsCount and ends trial at limit", async () => {
    process.env.PRACTICE_TRIAL_ENABLED = "true";
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";

    const teamState = {
      trialStartedAt: new Date(),
      trialEndedAt: null as Date | null,
      isTrialActive: true,
      trialBookingsCount: 9,
    };

    const prisma = {
      team: {
        findUnique: vi.fn(async () => ({ ...teamState })),
        update: vi.fn(async ({ data }: { data: { trialBookingsCount?: { increment: number } } }) => {
          if (data.trialBookingsCount?.increment) {
            teamState.trialBookingsCount += data.trialBookingsCount.increment;
          }
          if ("isTrialActive" in data) {
            teamState.isTrialActive = data.isTrialActive as boolean;
            teamState.trialEndedAt = data.trialEndedAt as Date;
          }
          return { ...teamState };
        }),
        updateMany: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
          teamState.isTrialActive = data.isTrialActive as boolean;
          teamState.trialEndedAt = data.trialEndedAt as Date;
          return { count: 1 };
        }),
      },
      membership: {
        findFirst: vi.fn(),
      },
    };

    const service = new PracticeTrialService(prisma as never);
    await service.incrementBookingsCount(1);

    expect(teamState.trialBookingsCount).toBe(10);
    expect(teamState.isTrialActive).toBe(false);
    expect(checkTrialEligibility(teamState).isExpired).toBe(true);
  });
});
