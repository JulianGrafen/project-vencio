import dayjs from "@calcom/dayjs";

import type { PrismaClient } from "@calcom/prisma";

export type SmartFillPatientCandidate = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  waitlistEnabled: boolean;
  lastVisitAt: Date | null;
  priorityScore: number;
  score: number;
};

export type PatientSelectionParams = {
  teamId: number;
  eventTypeId?: number | null;
  limit?: number;
};

/**
 * Ranks patients for Smart-Fill outreach.
 *
 * Priority formula (higher = contacted first):
 * - Waitlist flag: +1000
 * - Days since last visit (recall): +min(days, 365)
 * - Manual priorityScore from practice admin
 */
export class SmartFillPatientSelectionService {
  constructor(private readonly prisma: PrismaClient) {}

  async selectCandidates(params: PatientSelectionParams): Promise<SmartFillPatientCandidate[]> {
    const limit = params.limit ?? 5;

    const patients = await this.prisma.smartFillPatient.findMany({
      where: {
        teamId: params.teamId,
        ...(params.eventTypeId
          ? {
              OR: [{ preferredEventTypeId: null }, { preferredEventTypeId: params.eventTypeId }],
            }
          : {}),
      },
      orderBy: [{ waitlistEnabled: "desc" }, { lastVisitAt: "asc" }, { priorityScore: "desc" }],
      take: limit * 3,
    });

    const now = dayjs();

    return patients
      .map((patient) => {
        const recallDays = patient.lastVisitAt
          ? now.diff(dayjs(patient.lastVisitAt), "day")
          : 365;
        const score =
          (patient.waitlistEnabled ? 1000 : 0) +
          Math.min(Math.max(recallDays, 0), 365) +
          patient.priorityScore;

        return {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          phoneNumber: patient.phoneNumber,
          waitlistEnabled: patient.waitlistEnabled,
          lastVisitAt: patient.lastVisitAt,
          priorityScore: patient.priorityScore,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
