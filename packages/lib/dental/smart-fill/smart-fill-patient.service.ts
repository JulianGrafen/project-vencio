import type { Prisma, PrismaClient } from "@calcom/prisma";

import { normalizePhoneNumber } from "./phone-utils";

type CreatePatientInput = {
  teamId: number;
  name: string;
  email: string;
  phoneNumber: string;
  waitlistEnabled: boolean;
  priorityScore: number;
  preferredEventTypeId?: number | null;
};

type UpdatePatientInput = {
  teamId: number;
  patientId: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  waitlistEnabled?: boolean;
  priorityScore?: number;
  preferredEventTypeId?: number | null;
};

const SMART_FILL_PATIENT_SELECT = {
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
  waitlistEnabled: true,
  lastVisitAt: true,
  priorityScore: true,
  preferredEventTypeId: true,
  createdAt: true,
} as const satisfies Prisma.SmartFillPatientSelect;

type SmartFillPatientListItem = Prisma.SmartFillPatientGetPayload<{
  select: typeof SMART_FILL_PATIENT_SELECT;
}>;

export class SmartFillPatientService {
  constructor(private readonly prisma: PrismaClient) {}

  listByTeam(teamId: number): Promise<SmartFillPatientListItem[]> {
    return this.prisma.smartFillPatient.findMany({
      where: { teamId },
      orderBy: [{ waitlistEnabled: "desc" }, { priorityScore: "desc" }, { name: "asc" }],
      select: SMART_FILL_PATIENT_SELECT,
    });
  }

  findByTeam(teamId: number, patientId: string) {
    return this.prisma.smartFillPatient.findFirst({
      where: { id: patientId, teamId },
    });
  }

  create(input: CreatePatientInput): Promise<SmartFillPatientListItem> {
    return this.prisma.smartFillPatient.create({
      data: {
        teamId: input.teamId,
        name: input.name,
        email: input.email,
        phoneNumber: normalizePhoneNumber(input.phoneNumber),
        waitlistEnabled: input.waitlistEnabled,
        priorityScore: input.priorityScore,
        preferredEventTypeId: input.preferredEventTypeId ?? null,
      },
      select: SMART_FILL_PATIENT_SELECT,
    });
  }

  update(input: UpdatePatientInput): Promise<SmartFillPatientListItem> {
    let phoneNumber: string | undefined;
    if (input.phoneNumber !== undefined) {
      phoneNumber = normalizePhoneNumber(input.phoneNumber);
    }

    return this.prisma.smartFillPatient.update({
      where: { id: input.patientId },
      data: {
        name: input.name,
        email: input.email,
        phoneNumber,
        waitlistEnabled: input.waitlistEnabled,
        priorityScore: input.priorityScore,
        preferredEventTypeId: input.preferredEventTypeId,
      },
      select: SMART_FILL_PATIENT_SELECT,
    });
  }

  delete(patientId: string) {
    return this.prisma.smartFillPatient.delete({ where: { id: patientId } });
  }
}
