import type { PrismaClient } from "@calcom/prisma";
import { SmartFillTaskStatus } from "@calcom/prisma/enums";
import { randomUUID } from "node:crypto";

import { SMART_FILL_STALE_TASK_STATUSES } from "./constants";
import { invitePatientsForSmartFillTask, shouldSendSmartFillInvite } from "./smart-fill-cron-invite";
import { loadSmartFillEligibleHosts } from "./smart-fill-cron-host-loader";
import { scanSmartFillSlotsForHost } from "./smart-fill-cron-slot-scan";
import { upsertSmartFillTask } from "./smart-fill-cron-task-upsert";
import { SmartFillPatientSelectionService } from "./smart-fill-patient-selection.service";
import { releaseSmartFillHoldBooking } from "./smart-fill-slot-hold";
import type { SmsService } from "./sms/sms-service.interface";
import { createSmsService } from "./sms/mock-sms-service";

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
 * 3. Select patients and send SMS invites
 */
export class SmartFillCronService {
  private readonly patientSelection: SmartFillPatientSelectionService;
  private readonly sms: SmsService;

  constructor(
    private readonly prisma: PrismaClient,
    smsService?: SmsService
  ) {
    this.patientSelection = new SmartFillPatientSelectionService(prisma);
    this.sms = smsService ?? createSmsService();
  }

  async run(): Promise<SmartFillCronResult> {
    const scanRunId = randomUUID();
    const errors: string[] = [];
    let tasksCreated = 0;
    let invitesSent = 0;

    const hosts = await loadSmartFillEligibleHosts(this.prisma);

    for (const host of hosts) {
      try {
        const slots = await scanSmartFillSlotsForHost(this.prisma, host);
        for (const slot of slots) {
          const task = await upsertSmartFillTask(this.prisma, host, slot, scanRunId);
          if (task.created) tasksCreated++;

          if (await shouldSendSmartFillInvite(this.prisma, task.task.id, task.task.status)) {
            invitesSent += await invitePatientsForSmartFillTask(
              this.prisma,
              { sms: this.sms, patientSelection: this.patientSelection },
              task.task.id,
              host
            );
          }
        }
      } catch (error) {
        errors.push(
          `team=${host.teamId} user=${host.userId}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    await this.expireStaleTasks();

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
