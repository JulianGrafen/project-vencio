import type { PrismaClient } from "@calcom/prisma";

import { RECALL_PENDING_LOOKAHEAD_DAYS } from "./constants";
import { RecallCandidateService } from "./recall-candidate.service";
import { RecallSettingsService } from "./recall-settings.service";

export type PendingRecallItem = {
  patientId: string;
  patientName: string;
  email: string;
  lastVisitAt: string;
  recallDueDate: string;
  daysUntilDue: number;
};

/**
 * Dashboard API: pending recalls for the upcoming week.
 */
export class RecallPendingService {
  private readonly settingsService: RecallSettingsService;
  private readonly candidateService: RecallCandidateService;

  constructor(private readonly prisma: PrismaClient) {
    this.settingsService = new RecallSettingsService(prisma);
    this.candidateService = new RecallCandidateService(prisma);
  }

  async listPendingForTeam(teamId: number): Promise<PendingRecallItem[]> {
    const settings = await this.settingsService.getOrCreateForTeam(teamId);

    if (!settings.enabled) {
      return [];
    }

    const candidates = await this.candidateService.findPendingForWeek(
      teamId,
      settings.intervalMonths,
      RECALL_PENDING_LOOKAHEAD_DAYS
    );

    const now = Date.now();

    return candidates.map((candidate) => ({
      patientId: candidate.patientId,
      patientName: candidate.name,
      email: candidate.email,
      lastVisitAt: candidate.lastVisitAt.toISOString(),
      recallDueDate: candidate.recallDueDate.toISOString(),
      daysUntilDue: Math.ceil((candidate.recallDueDate.getTime() - now) / (1000 * 60 * 60 * 24)),
    }));
  }
}
