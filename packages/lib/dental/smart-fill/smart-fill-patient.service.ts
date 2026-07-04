import type { PrismaClient } from "@calcom/prisma/generated/prisma/client";

import { normalizePhoneNumber } from "./phone-utils";
import {
  SMART_FILL_PATIENT_SELECT,
  type SmartFillPatientListItem,
} from "./smart-fill-patient.select";

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

export class SmartFillPatientNotFoundError extends Error {
  constructor(patientId: string, teamId: number) {
    super(`SmartFill patient not found: ${patientId} (team ${teamId})`);
    this.name = "SmartFillPatientNotFoundError";
  }
}

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

  async update(input: UpdatePatientInput): Promise<SmartFillPatientListItem> {
    let phoneNumber: string | undefined;
    if (input.phoneNumber !== undefined) {
      phoneNumber = normalizePhoneNumber(input.phoneNumber);
    }

    const updated = await this.prisma.smartFillPatient.updateMany({
      where: { id: input.patientId, teamId: input.teamId },
      data: {
        name: input.name,
        email: input.email,
        phoneNumber,
        waitlistEnabled: input.waitlistEnabled,
        priorityScore: input.priorityScore,
        preferredEventTypeId: input.preferredEventTypeId,
      },
    });

    if (updated.count === 0) {
      throw new SmartFillPatientNotFoundError(input.patientId, input.teamId);
    }

    const patient = await this.prisma.smartFillPatient.findFirst({
      where: { id: input.patientId, teamId: input.teamId },
      select: SMART_FILL_PATIENT_SELECT,
    });
    if (!patient) {
      throw new SmartFillPatientNotFoundError(input.patientId, input.teamId);
    }

    return patient;
  }

  async delete(teamId: number, patientId: string): Promise<void> {
    const deleted = await this.prisma.smartFillPatient.deleteMany({
      where: { id: patientId, teamId },
    });

    if (deleted.count === 0) {
      throw new SmartFillPatientNotFoundError(patientId, teamId);
    }
  }
}
