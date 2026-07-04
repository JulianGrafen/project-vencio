import { MedicalProfileService } from "@calcom/lib/dental/medical-categories/medical-profile.service";
import { ErrorWithCode } from "@calcom/lib/errors";
import { prisma } from "@calcom/prisma";
import { TRPCError } from "@trpc/server";

import { dentalTeamAdminProcedure } from "../../../procedures/dentalTeamAdminProcedure";
import { dentalTeamMemberProcedure } from "../../../procedures/dentalTeamMemberProcedure";
import { router } from "../../../trpc";
import {
  ZMedicalProfileGetInput,
  ZMedicalProfileListInput,
  ZMedicalProfileUpsertInput,
} from "./_schemas";

const service = new MedicalProfileService(prisma);

function toTRPCError(error: unknown): never {
  if (error instanceof ErrorWithCode) {
    throw new TRPCError({ code: "NOT_FOUND", message: error.message });
  }
  throw error;
}

export const medicalProfilesRouter = router({
  /** Team event types with their medical profile — practice settings UI. */
  list: dentalTeamMemberProcedure(ZMedicalProfileListInput).query(async ({ input }) => {
    return service.listForTeam(input.teamId);
  }),

  get: dentalTeamMemberProcedure(ZMedicalProfileGetInput).query(async ({ input }) => {
    return service.getForEventType(input.teamId, input.eventTypeId).catch(toTRPCError);
  }),

  upsert: dentalTeamAdminProcedure(ZMedicalProfileUpsertInput).mutation(async ({ input }) => {
    return service.upsert(input).catch(toTRPCError);
  }),
});
