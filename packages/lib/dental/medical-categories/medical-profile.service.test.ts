import { describe, expect, it, vi } from "vitest";

import { ErrorCode } from "@calcom/lib/errorCodes";

import { MedicalProfileService } from "./medical-profile.service";

const TEAM_ID = 7;
const EVENT_TYPE_ID = 42;

function buildDb({
  eventTypeTeamId = TEAM_ID,
  profile = null,
}: {
  eventTypeTeamId?: number | null;
  profile?: unknown;
} = {}) {
  return {
    eventType: {
      findUnique: vi.fn(async () => ({ teamId: eventTypeTeamId, parentId: null })),
      findMany: vi.fn(async () => []),
    },
    eventTypeMedicalProfile: {
      findUnique: vi.fn(async () => profile),
      upsert: vi.fn(async () => profile),
    },
  };
}

describe("MedicalProfileService", () => {
  describe("getForEventType", () => {
    it("returns the profile for an event type of the practice", async () => {
      const profile = { eventTypeId: EVENT_TYPE_ID, category: "PROPHYLAXE" };
      const db = buildDb({ profile });

      const service = new MedicalProfileService(db as never);
      const result = await service.getForEventType(TEAM_ID, EVENT_TYPE_ID);

      expect(result).toEqual(profile);
    });

    it("rejects event types of a different practice with a typed error", async () => {
      const db = buildDb({ eventTypeTeamId: 999 });

      const service = new MedicalProfileService(db as never);

      await expect(service.getForEventType(TEAM_ID, EVENT_TYPE_ID)).rejects.toMatchObject({
        code: ErrorCode.EventTypeNotFound,
      });
      expect(db.eventTypeMedicalProfile.findUnique).not.toHaveBeenCalled();
    });
  });

  describe("upsert", () => {
    it("upserts the profile scoped to the event type", async () => {
      const db = buildDb();
      const service = new MedicalProfileService(db as never);

      await service.upsert({
        teamId: TEAM_ID,
        eventTypeId: EVENT_TYPE_ID,
        category: "SCHMERZBEHANDLUNG",
        allowedInsuranceTypes: [],
        isEmergency: true,
      });

      expect(db.eventTypeMedicalProfile.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { eventTypeId: EVENT_TYPE_ID },
          create: expect.objectContaining({
            eventTypeId: EVENT_TYPE_ID,
            category: "SCHMERZBEHANDLUNG",
            isEmergency: true,
          }),
        })
      );
    });

    it("never writes profiles for foreign event types", async () => {
      const db = buildDb({ eventTypeTeamId: null });
      const service = new MedicalProfileService(db as never);

      await expect(
        service.upsert({
          teamId: TEAM_ID,
          eventTypeId: EVENT_TYPE_ID,
          category: "KONTROLLE",
          allowedInsuranceTypes: [],
        })
      ).rejects.toMatchObject({ code: ErrorCode.EventTypeNotFound });
      expect(db.eventTypeMedicalProfile.upsert).not.toHaveBeenCalled();
    });
  });
});
