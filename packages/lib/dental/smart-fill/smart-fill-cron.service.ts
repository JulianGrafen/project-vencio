import dayjs from "@calcom/dayjs";
import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus, SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";
import { randomUUID } from "node:crypto";

import {
  SMART_FILL_DEFAULT_REVENUE_CENTS,
  SMART_FILL_LOOKAHEAD_HOURS,
  SMART_FILL_MIN_GAP_MINUTES,
} from "./constants";
import { SmartFillPatientSelectionService } from "./smart-fill-patient-selection.service";
import {
  findSmartFillCandidateSlots,
  type WeeklyAvailabilityWindow,
} from "./smart-fill-slot-scanner";
import type { SmsService } from "./sms/sms-service.interface";
import { createSmsService } from "./sms/mock-sms-service";

export type SmartFillCronResult = {
  scanRunId: string;
  tasksCreated: number;
  invitesSent: number;
  errors: string[];
};

type TeamHost = {
  teamId: number;
  userId: number;
  timeZone: string;
  eventTypeId: number | null;
  eventTypeTitle: string | null;
  revenueCents: number;
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

    const hosts = await this.loadEligibleHosts();

    for (const host of hosts) {
      try {
        const slots = await this.scanHostSlots(host);
        for (const slot of slots) {
          const task = await this.upsertTask(host, slot, scanRunId);
          if (task.created) tasksCreated++;

          if (task.task.status === SmartFillTaskStatus.PENDING) {
            const sent = await this.invitePatientsForTask(task.task.id, host);
            invitesSent += sent;
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

  private async loadEligibleHosts(): Promise<TeamHost[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { accepted: true, team: { isOrganization: false } },
      select: {
        teamId: true,
        user: {
          select: {
            id: true,
            timeZone: true,
            eventTypes: {
              where: { hidden: false },
              select: { id: true, title: true, length: true, teamId: true },
              take: 1,
              orderBy: { id: "asc" },
            },
          },
        },
      },
    });

    return memberships
      .filter((m) => m.user.eventTypes.length > 0)
      .map((m) => {
        const eventType = m.user.eventTypes[0];
        return {
          teamId: m.teamId,
          userId: m.user.id,
          timeZone: m.user.timeZone,
          eventTypeId: eventType.id,
          eventTypeTitle: eventType.title,
          revenueCents: SMART_FILL_DEFAULT_REVENUE_CENTS,
        };
      });
  }

  private async scanHostSlots(host: TeamHost) {
    const now = dayjs();
    const windowStart = now.toDate();
    const windowEnd = now.add(SMART_FILL_LOOKAHEAD_HOURS, "hour").toDate();

    const schedule = await this.prisma.schedule.findFirst({
      where: { userId: host.userId },
      include: { availability: true },
    });

    const availability: WeeklyAvailabilityWindow[] =
      schedule?.availability.map((a) => ({
        dayOfWeek: a.days[0] ?? 1,
        startMinutes: dayjs(a.startTime).hour() * 60 + dayjs(a.startTime).minute(),
        endMinutes: dayjs(a.endTime).hour() * 60 + dayjs(a.endTime).minute(),
      })) ?? this.defaultAvailability();

    const bookings = await this.prisma.booking.findMany({
      where: {
        userId: host.userId,
        status: { in: [BookingStatus.ACCEPTED, BookingStatus.PENDING, BookingStatus.AWAITING_HOST] },
        startTime: { lt: windowEnd },
        endTime: { gt: windowStart },
      },
      select: { startTime: true, endTime: true },
    });

    return findSmartFillCandidateSlots({
      windowStart,
      windowEnd,
      minDurationMinutes: SMART_FILL_MIN_GAP_MINUTES,
      availability,
      busyIntervals: bookings.map((b) => ({ start: b.startTime, end: b.endTime })),
      timeZone: host.timeZone,
    });
  }

  private defaultAvailability(): WeeklyAvailabilityWindow[] {
    return [1, 2, 3, 4, 5].map((day) => ({
      dayOfWeek: day,
      startMinutes: 9 * 60,
      endMinutes: 17 * 60,
    }));
  }

  private async upsertTask(
    host: TeamHost,
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

  private async invitePatientsForTask(taskId: string, host: TeamHost): Promise<number> {
    const task = await this.prisma.smartFillTask.findUniqueOrThrow({ where: { id: taskId } });
    const patients = await this.patientSelection.selectCandidates({
      teamId: host.teamId,
      eventTypeId: host.eventTypeId,
      limit: 1,
    });

    if (patients.length === 0) return 0;

    const patient = patients[0];
    const startFormatted = dayjs(task.startTime).tz(host.timeZone).format("DD.MM. HH:mm");
    const body = `Guten Tag ${patient.name}, in der Praxis ist am ${startFormatted} ein Termin frei geworden (${host.eventTypeTitle ?? "Behandlung"}). Antworten Sie mit JA zur Bestätigung.`;

    const smsResult = await this.sms.send({
      to: patient.phoneNumber,
      body,
      teamId: host.teamId,
      metadata: { taskId, patientId: patient.id },
    });

    await this.prisma.smartFillInvite.create({
      data: {
        taskId: task.id,
        patientId: patient.id,
        status: SmartFillInviteStatus.SENT,
        messageSid: smsResult.messageSid,
      },
    });

    await this.prisma.smartFillTask.update({
      where: { id: task.id },
      data: { status: SmartFillTaskStatus.INVITED },
    });

    return 1;
  }

  private async expireStaleTasks() {
    await this.prisma.smartFillTask.updateMany({
      where: {
        status: { in: [SmartFillTaskStatus.PENDING, SmartFillTaskStatus.INVITED] },
        startTime: { lt: new Date() },
      },
      data: { status: SmartFillTaskStatus.EXPIRED },
    });
  }
}
