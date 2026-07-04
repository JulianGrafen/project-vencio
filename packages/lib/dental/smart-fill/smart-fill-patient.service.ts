import type { PrismaClient } from "@calcom/prisma/generated/prisma/client";

import { isDentalEncryptionEnabled } from "../feature-flags";
import { normalizePhoneNumber, resolveSmartFillPatientPhone } from "./phone-utils";
import {
  resolveSmartFillPatientPhoneLookupKey,
} from "./smart-fill-patient-phone-index";
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
  recallEnabled?: boolean;
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
  recallEnabled?: boolean;
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
    const phoneNumber = resolveSmartFillPatientPhone(input.phoneNumber, input.email);
    const phoneBlindIndex = isDentalEncryptionEnabled()
      ? undefined
      : resolveSmartFillPatientPhoneLookupKey(phoneNumber);

    return this.prisma.smartFillPatient.create({
      data: {
        teamId: input.teamId,
        name: input.name,
        email: input.email,
        phoneNumber,
        ...(phoneBlindIndex ? { phoneBlindIndex } : {}),
        waitlistEnabled: input.waitlistEnabled,
        recallEnabled: input.recallEnabled ?? true,
        priorityScore: input.priorityScore,
        preferredEventTypeId: input.preferredEventTypeId ?? null,
      },
      select: SMART_FILL_PATIENT_SELECT,
    });
  }

  async update(input: UpdatePatientInput): Promise<SmartFillPatientListItem> {
    let phoneNumber: string | undefined;
    let phoneBlindIndex: string | undefined;
    if (input.phoneNumber !== undefined) {
      phoneNumber = normalizePhoneNumber(input.phoneNumber);
      if (!isDentalEncryptionEnabled()) {
        phoneBlindIndex = resolveSmartFillPatientPhoneLookupKey(phoneNumber);
      }
    }

    const updated = await this.prisma.smartFillPatient.updateMany({
      where: { id: input.patientId, teamId: input.teamId },
      data: {
        name: input.name,
        email: input.email,
        phoneNumber,
        phoneBlindIndex,
        waitlistEnabled: input.waitlistEnabled,
        recallEnabled: input.recallEnabled,
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
