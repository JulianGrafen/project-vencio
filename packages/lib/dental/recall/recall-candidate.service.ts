import dayjs from "@calcom/dayjs";
import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

import { DENTAL_BLOCKING_BOOKING_STATUSES } from "../constants";

export type RecallCandidate = {
  patientId: string;
  teamId: number;
  name: string;
  email: string;
  phoneNumber: string;
  lastVisitAt: Date;
  recallDueDate: Date;
};

type FindDueCandidatesParams = {
  teamId: number;
  intervalMonths: number;
  toleranceDays: number;
  referenceDate?: Date;
};

/**
 * Finds patients due for prophylaxis recall and applies exclusion rules.
 */
export class RecallCandidateService {
  constructor(private readonly prisma: PrismaClient) {}

  async findDueCandidates(params: FindDueCandidatesParams): Promise<RecallCandidate[]> {
    const reference = dayjs(params.referenceDate ?? new Date()).startOf("day");

    const patients = await this.prisma.smartFillPatient.findMany({
      where: {
        teamId: params.teamId,
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
      if (!patient.lastVisitAt) continue;

      const recallDueDate = dayjs(patient.lastVisitAt)
        .add(params.intervalMonths, "month")
        .startOf("day");

      const daysPastDue = reference.diff(recallDueDate, "day");

      if (daysPastDue < 0 || daysPastDue > params.toleranceDays) {
        continue;
      }

      if (await this.hasUpcomingBooking(patient.teamId, patient.email)) {
        continue;
      }

      due.push({
        patientId: patient.id,
        teamId: patient.teamId,
        name: patient.name,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        lastVisitAt: patient.lastVisitAt,
        recallDueDate: recallDueDate.toDate(),
      });
    }

    return due;
  }

  /**
   * Patients due within the next N days who have not yet received a recall this cycle.
   */
  async findPendingForWeek(
    teamId: number,
    intervalMonths: number,
    lookaheadDays: number,
    referenceDate?: Date
  ): Promise<RecallCandidate[]> {
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
      if (!patient.lastVisitAt) continue;

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
          status: { in: ["SENT", "PENDING"] },
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
