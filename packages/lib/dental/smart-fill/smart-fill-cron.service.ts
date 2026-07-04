import type { PrismaClient } from "@calcom/prisma";
import { SmartFillTaskStatus } from "@calcom/prisma/enums";
import { randomUUID } from "node:crypto";

import { createDentalLogger } from "../resilience/dental-logger";
import { SMART_FILL_STALE_TASK_STATUSES } from "./constants";
import { invitePatientsForSmartFillTask, shouldSendSmartFillInvite } from "./smart-fill-cron-invite";
import { loadSmartFillEligibleHosts } from "./smart-fill-cron-host-loader";
import { scanSmartFillSlotsForHost } from "./smart-fill-cron-slot-scan";
import { upsertSmartFillTask } from "./smart-fill-cron-task-upsert";
import { SmartFillPatientSelectionService } from "./smart-fill-patient-selection.service";
import { releaseSmartFillHoldBooking } from "./smart-fill-slot-hold";
import type { SmartFillInviteEmailTransport } from "./email/smart-fill-invite-email-transport.interface";
import { createSmartFillInviteEmailTransport } from "./email/mock-smart-fill-invite-email-transport";

export type SmartFillCronResult = {
  scanRunId: string;
  tasksCreated: number;
  invitesSent: number;
  errors: string[];
};

/**
 * Orchestrates the Smart-Fill cron pipeline:
 * 1. Scan calendars for gaps within lookahead window
 * 2. Persist SmartFillTask rows
 * 3. Select patients and send email invites
 */
export class SmartFillCronService {
  private readonly log = createDentalLogger({ module: "smart-fill-cron" });
  private readonly patientSelection: SmartFillPatientSelectionService;
  private readonly email: SmartFillInviteEmailTransport;

  constructor(
    private readonly prisma: PrismaClient,
    emailTransport?: SmartFillInviteEmailTransport
  ) {
    this.patientSelection = new SmartFillPatientSelectionService(prisma);
    this.email = emailTransport ?? createSmartFillInviteEmailTransport();
  }

  async run(): Promise<SmartFillCronResult> {
    const scanRunId = randomUUID();
    const errors: string[] = [];
    let tasksCreated = 0;
    let invitesSent = 0;

    const hosts = await loadSmartFillEligibleHosts(this.prisma);
    this.log.info("Smart-Fill cron started", { scanRunId, hostCount: hosts.length });

    for (const host of hosts) {
      try {
        const team = await this.prisma.team.findUnique({
          where: { id: host.teamId },
          select: { name: true },
        });
        const slots = await scanSmartFillSlotsForHost(this.prisma, host);
        for (const slot of slots) {
          const task = await upsertSmartFillTask(this.prisma, host, slot, scanRunId);
          if (task.created) tasksCreated++;

          if (await shouldSendSmartFillInvite(this.prisma, task.task.id, task.task.status)) {
            invitesSent += await invitePatientsForSmartFillTask(
              this.prisma,
              {
                email: this.email,
                patientSelection: this.patientSelection,
                practiceName: team?.name,
              },
              task.task.id,
              host
            );
          }
        }
      } catch (error) {
        const message = `team=${host.teamId} user=${host.userId}: ${error instanceof Error ? error.message : String(error)}`;
        errors.push(message);
        this.log.error("Smart-Fill cron host failed", { scanRunId, teamId: host.teamId, error: message });
      }
    }

    await this.expireStaleTasks();

    this.log.info("Smart-Fill cron finished", { scanRunId, tasksCreated, invitesSent, errorCount: errors.length });

    return { scanRunId, tasksCreated, invitesSent, errors };
  }

  private async expireStaleTasks() {
    const staleTasks = await this.prisma.smartFillTask.findMany({
      where: {
        status: { in: [...SMART_FILL_STALE_TASK_STATUSES] },
        startTime: { lt: new Date() },
      },
      select: { id: true, metadata: true },
    });

    for (const task of staleTasks) {
      await releaseSmartFillHoldBooking(this.prisma, task.id, task.metadata);
    }

    await this.prisma.smartFillTask.updateMany({
      where: {
        status: { in: [...SMART_FILL_STALE_TASK_STATUSES] },
        startTime: { lt: new Date() },
      },
      data: { status: SmartFillTaskStatus.EXPIRED },
    });
  }
}
