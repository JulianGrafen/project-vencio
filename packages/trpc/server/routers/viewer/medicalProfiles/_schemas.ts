import { z } from "zod";

import { ZMedicalProfileGetInput, ZMedicalProfileUpsertInput } from "@calcom/lib/dental/medical-categories/schemas";

export const ZMedicalProfileListInput = z.object({
  teamId: z.number().int().positive(),
});

export { ZMedicalProfileGetInput, ZMedicalProfileUpsertInput };
