import dayjs from "@calcom/dayjs";
import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

import { DENTAL_BLOCKING_BOOKING_STATUSES } from "../constants";
import { err, ok, type Result } from "../resilience/result";
import {
  RECALL_CANDIDATE_PATIENT_SELECT,
  type RecallCandidatePatientRow,
} from "./recall-candidate.select";
import { RecallHistoryService } from "./recall-history.service";
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
  private readonly historyService: RecallHistoryService;

  constructor(private readonly prisma: PrismaClient) {
    this.historyService = new RecallHistoryService(prisma);
  }

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
    const patients = await this.loadRecallPatients(teamId);
    const due: RecallCandidate[] = [];

    for (const patient of patients) {
      const candidate = await this.toCandidateIfDue({
        patient,
        intervalMonths,
        reference,
        isDue: (recallDueDate) => {
          const daysPastDue = reference.diff(recallDueDate, "day");
          return daysPastDue >= 0 && daysPastDue <= toleranceDays;
        },
      });

      if (candidate) {
        due.push(candidate);
      }
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
    const patients = await this.loadRecallPatients(teamId);
    const pending: RecallCandidate[] = [];

    for (const patient of patients) {
      const candidate = await this.toCandidateIfDue({
        patient,
        intervalMonths,
        reference,
        isDue: (recallDueDate) =>
          !recallDueDate.isBefore(reference) && !recallDueDate.isAfter(windowEnd),
        skipIfHistoryExists: true,
      });

      if (candidate) {
        pending.push(candidate);
      }
    }

    return pending.sort((a, b) => a.recallDueDate.getTime() - b.recallDueDate.getTime());
  }

  private async loadRecallPatients(teamId: number): Promise<RecallCandidatePatientRow[]> {
    return this.prisma.smartFillPatient.findMany({
      where: {
        teamId,
        recallEnabled: true,
        lastVisitAt: { not: null },
      },
      select: RECALL_CANDIDATE_PATIENT_SELECT,
    });
  }

  private async toCandidateIfDue(params: {
    patient: RecallCandidatePatientRow;
    intervalMonths: number;
    reference: dayjs.Dayjs;
    isDue: (recallDueDate: dayjs.Dayjs) => boolean;
    skipIfHistoryExists?: boolean;
  }): Promise<RecallCandidate | null> {
    const { patient, intervalMonths, isDue, skipIfHistoryExists } = params;

    if (!patient.lastVisitAt || !patient.email?.trim()) {
      return null;
    }

    const recallDueDate = dayjs(patient.lastVisitAt).add(intervalMonths, "month").startOf("day");
    if (!isDue(recallDueDate)) {
      return null;
    }

    if (await this.hasUpcomingBooking(patient.teamId, patient.email)) {
      return null;
    }

    const recallDueDateValue = recallDueDate.toDate();

    if (
      skipIfHistoryExists &&
      (await this.historyService.hasActiveRecall({
        patientId: patient.id,
        recallDueDate: recallDueDateValue,
      }))
    ) {
      return null;
    }

    const candidate = {
      patientId: patient.id,
      teamId: patient.teamId,
      name: patient.name,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      lastVisitAt: patient.lastVisitAt,
      recallDueDate: recallDueDateValue,
    };

    const validated = ZRecallCandidate.safeParse(candidate);
    return validated.success ? validated.data : null;
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
