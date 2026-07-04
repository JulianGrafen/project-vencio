import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import type { PrismaClient } from "@calcom/prisma";

import { resolveTeamIdFromEventTypeId } from "../practice-team-resolver";
import type { MedicalProfileUpsertInput } from "./schemas";

type MedicalProfileDb = PrismaClient;

const MEDICAL_PROFILE_SELECT = {
  eventTypeId: true,
  category: true,
  allowedInsuranceTypes: true,
  displayOrder: true,
  isEmergency: true,
} as const;

/**
 * Manages the dental satellite profile of an event type (category, insurance
 * restrictions). All operations are tenant-scoped: the event type must belong
 * to the given practice (team), including managed child event types.
 */
export class MedicalProfileService {
  constructor(private readonly db: MedicalProfileDb) {}

  async listForTeam(teamId: number) {
    const eventTypes = await this.db.eventType.findMany({
      where: { teamId },
      orderBy: { position: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        hidden: true,
        medicalProfile: { select: MEDICAL_PROFILE_SELECT },
      },
    });

    return eventTypes;
  }

  async getForEventType(teamId: number, eventTypeId: number) {
    await this.assertEventTypeBelongsToTeam(teamId, eventTypeId);

    return this.db.eventTypeMedicalProfile.findUnique({
      where: { eventTypeId },
      select: MEDICAL_PROFILE_SELECT,
    });
  }

  async upsert(input: MedicalProfileUpsertInput) {
    const { teamId, eventTypeId, ...profile } = input;
    await this.assertEventTypeBelongsToTeam(teamId, eventTypeId);

    return this.db.eventTypeMedicalProfile.upsert({
      where: { eventTypeId },
      create: { eventTypeId, ...profile },
      update: profile,
      select: MEDICAL_PROFILE_SELECT,
    });
  }

  private async assertEventTypeBelongsToTeam(teamId: number, eventTypeId: number): Promise<void> {
    const resolvedTeamId = await resolveTeamIdFromEventTypeId(this.db, eventTypeId);

    if (resolvedTeamId !== teamId) {
      throw new ErrorWithCode(
        ErrorCode.EventTypeNotFound,
        `Event type ${eventTypeId} does not belong to practice ${teamId}`
      );
    }
  }
}
