import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

import { createDentalLogger } from "../resilience/dental-logger";
import {
  checkTrialEligibility,
  isTrialExpired,
  PRACTICE_TRIAL_SELECT,
  type PracticeTrialFields,
  type TrialEligibilityResult,
} from "./trial-eligibility";
import { isPracticeTrialEnabled } from "./trial-feature-flags";

const log = createDentalLogger({ module: "practice-trial" });

type TrialDb = Pick<PrismaClient, "team" | "membership">;

export class PracticeTrialService {
  constructor(private readonly prisma: TrialDb) {}

  async getTeamTrial(teamId: number): Promise<PracticeTrialFields | null> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: PRACTICE_TRIAL_SELECT,
    });
    return team;
  }

  async getEligibilityForTeam(teamId: number): Promise<TrialEligibilityResult | null> {
    if (!isPracticeTrialEnabled()) {
      return null;
    }

    const trial = await this.getTeamTrial(teamId);
    if (!trial) {
      return null;
    }

    await this.ensureTrialStarted(teamId, trial);
    const refreshed = await this.getTeamTrial(teamId);
    if (!refreshed) {
      return null;
    }

    const eligibility = checkTrialEligibility(refreshed);
    if (eligibility.isExpired && refreshed.isTrialActive && !refreshed.trialEndedAt) {
      await this.markTrialEnded(teamId, eligibility.reason ?? "time");
    }

    return checkTrialEligibility((await this.getTeamTrial(teamId)) ?? refreshed);
  }

  /** Primary team for a user — first accepted non-org membership. */
  async getPrimaryTeamIdForUser(userId: number): Promise<number | null> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        accepted: true,
        team: { isOrganization: false },
      },
      orderBy: { team: { name: "asc" } },
      select: { teamId: true },
    });
    return membership?.teamId ?? null;
  }

  async getEligibilityForUser(userId: number): Promise<(TrialEligibilityResult & { teamId: number }) | null> {
    const teamId = await this.getPrimaryTeamIdForUser(userId);
    if (!teamId) {
      return null;
    }

    const eligibility = await this.getEligibilityForTeam(teamId);
    if (!eligibility) {
      return null;
    }

    return { ...eligibility, teamId };
  }

  async ensureTrialStarted(teamId: number, trial?: PracticeTrialFields | null): Promise<void> {
    const current = trial ?? (await this.getTeamTrial(teamId));
    if (!current?.isTrialActive || current.trialStartedAt) {
      return;
    }

    await this.prisma.team.update({
      where: { id: teamId },
      data: { trialStartedAt: new Date() },
    });
  }

  async incrementBookingsCount(teamId: number): Promise<TrialEligibilityResult | null> {
    if (!isPracticeTrialEnabled()) {
      return null;
    }

    const trial = await this.getTeamTrial(teamId);
    if (!trial?.isTrialActive || isTrialExpired(trial)) {
      return trial ? checkTrialEligibility(trial) : null;
    }

    await this.ensureTrialStarted(teamId, trial);

    const updated = await this.prisma.team.update({
      where: { id: teamId },
      data: { trialBookingsCount: { increment: 1 } },
      select: PRACTICE_TRIAL_SELECT,
    });

    const eligibility = checkTrialEligibility(updated);
    if (eligibility.isExpired) {
      await this.markTrialEnded(teamId, eligibility.reason ?? "bookings");
      log.info("Practice trial ended after booking limit", { teamId, count: updated.trialBookingsCount });
    }

    return checkTrialEligibility((await this.getTeamTrial(teamId)) ?? updated);
  }

  async markTrialEnded(
    teamId: number,
    reason: "time" | "bookings" | "inactive" = "time"
  ): Promise<void> {
    await this.prisma.team.updateMany({
      where: { id: teamId, trialEndedAt: null },
      data: {
        isTrialActive: false,
        trialEndedAt: new Date(),
      },
    });
    log.info("Practice trial marked ended", { teamId, reason });
  }

  /** Call after a booking reaches ACCEPTED status for a team-hosted event type. */
  async recordAcceptedBooking(teamId: number | null | undefined): Promise<void> {
    if (!teamId || !isPracticeTrialEnabled()) {
      return;
    }
    await this.incrementBookingsCount(teamId);
  }
}

export function shouldCountBookingForTrial(status: BookingStatus): boolean {
  return status === BookingStatus.ACCEPTED;
}
