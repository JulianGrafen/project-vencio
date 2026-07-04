import dayjs from "@calcom/dayjs";
import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus, RecallHistoryStatus } from "@calcom/prisma/enums";

import { DENTAL_BLOCKING_BOOKING_STATUSES } from "../constants";
import { err, ok, type Result } from "../resilience/result";
import { ZRecallCandidate, ZRecallCandidateQuery } from "./recall.schemas";

export type RecallCandidate = {
  patientId: string;
  teamId: number;
  name: string;
  email: string;
  phoneNumber: string;
  lastVisitAt: Date;
  recallDueDate: Date;
};

/**
 * Finds patients due for prophylaxis recall and applies exclusion rules.
 */
export class RecallCandidateService {
  constructor(private readonly prisma: PrismaClient) {}

  async findDueCandidates(
    params: {
      teamId: number;
      intervalMonths: number;
      toleranceDays: number;
      referenceDate?: Date;
    }
  ): Promise<Result<RecallCandidate[], string>> {
    const parsed = ZRecallCandidateQuery.safeParse(params);
    if (!parsed.success) {
      return err(parsed.error.message);
    }

    const { teamId, intervalMonths, toleranceDays, referenceDate } = parsed.data;
    const reference = dayjs(referenceDate ?? new Date()).startOf("day");

    const patients = await this.prisma.smartFillPatient.findMany({
      where: {
        teamId,
        recallEnabled: true,
        lastVisitAt: { not: null },
      },
      select: {
        id: true,
        teamId: true,
        name: true,
        email: true,
        phoneNumber: true,
        lastVisitAt: true,
      },
    });

    const due: RecallCandidate[] = [];

    for (const patient of patients) {
      if (!patient.lastVisitAt || !patient.email?.trim()) {
        continue;
      }

      const recallDueDate = dayjs(patient.lastVisitAt).add(intervalMonths, "month").startOf("day");
      const daysPastDue = reference.diff(recallDueDate, "day");

      if (daysPastDue < 0 || daysPastDue > toleranceDays) {
        continue;
      }

      if (await this.hasUpcomingBooking(patient.teamId, patient.email)) {
        continue;
      }

      const candidate = {
        patientId: patient.id,
        teamId: patient.teamId,
        name: patient.name,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        lastVisitAt: patient.lastVisitAt,
        recallDueDate: recallDueDate.toDate(),
      };

      const validated = ZRecallCandidate.safeParse(candidate);
      if (!validated.success) {
        continue;
      }

      due.push(validated.data);
    }

    return ok(due);
  }

  async findPendingForWeek(
    teamId: number,
    intervalMonths: number,
    lookaheadDays: number,
    referenceDate?: Date
  ): Promise<RecallCandidate[]> {
    if (teamId <= 0 || intervalMonths < 1 || lookaheadDays < 0) {
      return [];
    }

    const reference = dayjs(referenceDate ?? new Date()).startOf("day");
    const windowEnd = reference.add(lookaheadDays, "day");

    const patients = await this.prisma.smartFillPatient.findMany({
      where: {
        teamId,
        recallEnabled: true,
        lastVisitAt: { not: null },
      },
      select: {
        id: true,
        teamId: true,
        name: true,
        email: true,
        phoneNumber: true,
        lastVisitAt: true,
      },
    });

    const pending: RecallCandidate[] = [];

    for (const patient of patients) {
      if (!patient.lastVisitAt || !patient.email?.trim()) continue;

      const recallDueDate = dayjs(patient.lastVisitAt).add(intervalMonths, "month").startOf("day");

      if (recallDueDate.isBefore(reference) || recallDueDate.isAfter(windowEnd)) {
        continue;
      }

      if (await this.hasUpcomingBooking(patient.teamId, patient.email)) {
        continue;
      }

      const alreadySent = await this.prisma.recallHistory.findFirst({
        where: {
          patientId: patient.id,
          recallDueDate: recallDueDate.toDate(),
          status: { in: [RecallHistoryStatus.SENT, RecallHistoryStatus.PENDING] },
        },
        select: { id: true },
      });

      if (alreadySent) {
        continue;
      }

      pending.push({
        patientId: patient.id,
        teamId: patient.teamId,
        name: patient.name,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        lastVisitAt: patient.lastVisitAt,
        recallDueDate: recallDueDate.toDate(),
      });
    }

    return pending.sort((a, b) => a.recallDueDate.getTime() - b.recallDueDate.getTime());
  }

  private async hasUpcomingBooking(teamId: number, patientEmail: string): Promise<boolean> {
    if (!patientEmail?.trim()) {
      return false;
    }

    const booking = await this.prisma.booking.findFirst({
      where: {
        startTime: { gt: new Date() },
        status: { in: DENTAL_BLOCKING_BOOKING_STATUSES as BookingStatus[] },
        attendees: { some: { email: patientEmail } },
        OR: [
          { eventType: { teamId } },
          { user: { teams: { some: { teamId, accepted: true } } } },
        ],
      },
      select: { id: true },
    });

    return booking !== null;
  }
}
