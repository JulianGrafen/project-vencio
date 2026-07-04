import { z } from "zod";

import {
  getPracticeBookingPublicKeyInfo,
  setPracticeBookingPublicKey,
} from "@calcom/lib/dental/token-booking/practice-public-key.service";

import { dentalTeamAdminProcedure } from "../../../procedures/dentalTeamAdminProcedure";
import { dentalTeamMemberProcedure } from "../../../procedures/dentalTeamMemberProcedure";
import { router } from "../../../trpc";

const ZEncryptionKeysTeamInput = z.object({
  teamId: z.number().int().positive(),
});

const ZSetBookingPublicKeyInput = z.object({
  teamId: z.number().int().positive(),
  publicKeyPem: z.string().min(1),
  keyVersion: z.number().int().positive().optional(),
});

export const encryptionKeysRouter = router({
  getBookingPublicKeyInfo: dentalTeamMemberProcedure(ZEncryptionKeysTeamInput).query(async ({ input }) => {
    return getPracticeBookingPublicKeyInfo(input.teamId);
  }),

  setBookingPublicKey: dentalTeamAdminProcedure(ZSetBookingPublicKeyInput).mutation(async ({ input }) => {
    return setPracticeBookingPublicKey({
      teamId: input.teamId,
      publicKeyPem: input.publicKeyPem,
      keyVersion: input.keyVersion,
    });
  }),
});
