import type { PrismaClient } from "@calcom/prisma";
import { RecallChannel, RecallHistoryStatus } from "@calcom/prisma/enums";

import { createDentalLogger } from "../resilience/dental-logger";
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
  private readonly log = createDentalLogger({ module: "recall-cron" });
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

        const candidatesResult = await this.candidateService.findDueCandidates({
          teamId: config.teamId,
          intervalMonths: settings.intervalMonths,
          toleranceDays: settings.toleranceDays,
          referenceDate,
        });

        if (!candidatesResult.success) {
          const message = `team=${config.teamId}: ${candidatesResult.error}`;
          errors.push(message);
          this.log.error("Failed to load recall candidates", new Error(candidatesResult.error), {
            teamId: config.teamId,
          });
          continue;
        }

        for (const candidate of candidatesResult.data) {
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

          const sendResult = await this.mailerService.sendRecall(candidate);

          if (!sendResult.success) {
            recallsFailed += 1;
            errors.push(`team=${config.teamId} patient=${candidate.patientId}: ${sendResult.error}`);
            this.log.warn("Recall send failed", {
              teamId: config.teamId,
              patientId: candidate.patientId,
              error: sendResult.error,
            });
            continue;
          }

          for (const result of sendResult.data) {
            if (result.status === RecallHistoryStatus.SENT) recallsSent += 1;
            if (result.status === RecallHistoryStatus.FAILED) recallsFailed += 1;
          }
        }
      } catch (error) {
        const message = `team=${config.teamId}: ${error instanceof Error ? error.message : String(error)}`;
        errors.push(message);
        this.log.error("Recall cron team processing failed", error, { teamId: config.teamId });
      }
    }

    this.log.info("Recall cron completed", {
      teamsProcessed,
      recallsSent,
      recallsFailed,
      skipped,
      errorCount: errors.length,
    });

    return { teamsProcessed, recallsSent, recallsFailed, skipped, errors };
  }
}
