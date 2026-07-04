import dayjs from "@calcom/dayjs";
import type { PrismaClient } from "@calcom/prisma";
import { SmartFillTaskStatus } from "@calcom/prisma/enums";
import { randomUUID } from "node:crypto";

import {
  SMART_FILL_STALE_TASK_STATUSES,
} from "./constants";
import { loadSmartFillEligibleHosts, type SmartFillCronHost } from "./smart-fill-cron-host-loader";
import { scanSmartFillSlotsForHost } from "./smart-fill-cron-slot-scan";
import {
  lockSmartFillTaskForInvite,
  rollbackSmartFillInvite,
} from "./smart-fill-invite-lifecycle";
import { SmartFillPatientSelectionService } from "./smart-fill-patient-selection.service";
import { buildSmartFillInviteSmsBody } from "./smart-fill-sms-message";
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
          const task = await this.upsertTask(host, slot, scanRunId);
          if (task.created) tasksCreated++;

          if (await this.shouldSendInvite(task.task.id, task.task.status)) {
            invitesSent += await this.invitePatientsForTask(task.task.id, host);
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

  private async upsertTask(
    host: SmartFillCronHost,
    slot: { start: Date; end: Date },
    scanRunId: string
  ): Promise<{ task: { id: string; status: SmartFillTaskStatus }; created: boolean }> {
    const durationMinutes = dayjs(slot.end).diff(dayjs(slot.start), "minute");

    const existing = await this.prisma.smartFillTask.findUnique({
      where: {
        teamId_userId_startTime_endTime: {
          teamId: host.teamId,
          userId: host.userId,
          startTime: slot.start,
          endTime: slot.end,
        },
      },
    });

    if (existing) {
      return { task: existing, created: false };
    }

    const task = await this.prisma.smartFillTask.create({
      data: {
        teamId: host.teamId,
        userId: host.userId,
        eventTypeId: host.eventTypeId,
        startTime: slot.start,
        endTime: slot.end,
        durationMinutes,
        status: SmartFillTaskStatus.PENDING,
        estimatedRevenueCents: host.revenueCents,
        scanRunId,
      },
    });

    return { task, created: true };
  }

  /** Only invite once per task — prevents duplicate SMS on every cron run. */
  private async shouldSendInvite(taskId: string, status: SmartFillTaskStatus): Promise<boolean> {
    if (status !== SmartFillTaskStatus.PENDING) {
      return false;
    }

    const existingInvites = await this.prisma.smartFillInvite.count({
      where: { taskId },
    });

    return existingInvites === 0;
  }

  private async invitePatientsForTask(taskId: string, host: SmartFillCronHost): Promise<number> {
    const patients = await this.patientSelection.selectCandidates({
      teamId: host.teamId,
      eventTypeId: host.eventTypeId,
      limit: 1,
    });

    if (patients.length === 0) return 0;

    const patient = patients[0];

    const lockedInvite = await this.prisma.$transaction((tx) =>
      lockSmartFillTaskForInvite(tx, {
        taskId,
        patientId: patient.id,
        host,
      })
    );

    if (!lockedInvite) {
      return 0;
    }

    const body = buildSmartFillInviteSmsBody({
      patientName: patient.name,
      slotStart: lockedInvite.task.startTime,
      timeZone: host.timeZone,
      treatmentTitle: host.eventTypeTitle,
    });

    try {
      const smsResult = await this.sms.send({
        to: patient.phoneNumber,
        body,
        teamId: host.teamId,
        metadata: { taskId, patientId: patient.id },
      });

      await this.prisma.smartFillInvite.update({
        where: { id: lockedInvite.inviteId },
        data: { messageSid: smsResult.messageSid },
      });

      return 1;
    } catch {
      await this.prisma.$transaction((tx) =>
        rollbackSmartFillInvite(tx, {
          taskId,
          inviteId: lockedInvite.inviteId,
          taskMetadata: lockedInvite.task.metadata,
        })
      );
      return 0;
    }
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
