import type { Prisma } from "@calcom/prisma/generated/prisma/client";

export type SmartFillActiveInvite = Prisma.SmartFillInviteGetPayload<{
  include: {
    patient: true;
    task: { include: { user: true; eventType: true } };
  };
}>;
