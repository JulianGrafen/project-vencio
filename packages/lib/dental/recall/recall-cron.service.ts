import type { PrismaClient } from "@calcom/prisma";
import { RecallChannel, RecallHistoryStatus } from "@calcom/prisma/enums";

import { RecallCandidateService } from "./recall-candidate.service";
import { RecallMailerService } from "./recall-mailer.service";
import { RecallSettingsService } from "./recall-settings.service";

export type RecallCronResult = {
  teamsProcessed: number;
  recallsSent: number;
  recallsFailed: number;
  skipped: number;
  errors: string[];
};

/**
 * Daily cron: scan all practices with recall enabled and send due prophylaxis reminders.
 */
export class RecallCronService {
  private readonly settingsService: RecallSettingsService;
  private readonly candidateService: RecallCandidateService;
  private readonly mailerService: RecallMailerService;

  constructor(private readonly prisma: PrismaClient) {
    this.settingsService = new RecallSettingsService(prisma);
    this.candidateService = new RecallCandidateService(prisma);
    this.mailerService = new RecallMailerService(prisma);
  }

  async run(referenceDate?: Date): Promise<RecallCronResult> {
    const errors: string[] = [];
    let teamsProcessed = 0;
    let recallsSent = 0;
    let recallsFailed = 0;
    let skipped = 0;

    const teamSettings = await this.prisma.recallSettings.findMany({
      where: { enabled: true },
      select: { teamId: true, intervalMonths: true, toleranceDays: true },
    });

    const teamIds =
      teamSettings.length > 0
        ? teamSettings
        : (
            await this.prisma.team.findMany({
              where: { smartFillPatients: { some: { recallEnabled: true, lastVisitAt: { not: null } } } },
              select: { id: true },
            })
          ).map((team) => ({
            teamId: team.id,
            intervalMonths: 6,
            toleranceDays: 3,
          }));

    for (const config of teamIds) {
      try {
        teamsProcessed += 1;

        const settings = await this.settingsService.getOrCreateForTeam(config.teamId);
        if (!settings.enabled) {
          skipped += 1;
          continue;
        }

        const candidates = await this.candidateService.findDueCandidates({
          teamId: config.teamId,
          intervalMonths: settings.intervalMonths,
          toleranceDays: settings.toleranceDays,
          referenceDate,
        });

        for (const candidate of candidates) {
          const existing = await this.prisma.recallHistory.findFirst({
            where: {
              patientId: candidate.patientId,
              recallDueDate: candidate.recallDueDate,
              channel: RecallChannel.EMAIL,
              status: { in: [RecallHistoryStatus.SENT, RecallHistoryStatus.PENDING] },
            },
          });

          if (existing) {
            skipped += 1;
            continue;
          }

          const results = await this.mailerService.sendRecall(candidate);
          for (const result of results) {
            if (result.status === RecallHistoryStatus.SENT) recallsSent += 1;
            if (result.status === RecallHistoryStatus.FAILED) recallsFailed += 1;
          }
        }
      } catch (error) {
        errors.push(
          `team=${config.teamId}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    return { teamsProcessed, recallsSent, recallsFailed, skipped, errors };
  }
}
