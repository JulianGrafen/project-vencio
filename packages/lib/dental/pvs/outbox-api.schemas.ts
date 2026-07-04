import { z } from "zod";

import { PVS_OUTBOX_POLL_MAX_LIMIT } from "./pvs-outbox.constants";

export const ZPvsOutboxPollBody = z.object({
  teamId: z.number().int().positive(),
  limit: z.number().int().min(1).max(PVS_OUTBOX_POLL_MAX_LIMIT).optional(),
});

export const ZPvsOutboxAckBody = z.discriminatedUnion("status", [
  z.object({
    teamId: z.number().int().positive(),
    outboxId: z.string().min(1),
    status: z.literal("COMPLETED"),
    externalId: z.string().min(1),
  }),
  z.object({
    teamId: z.number().int().positive(),
    outboxId: z.string().min(1),
    status: z.literal("FAILED"),
    error: z.string().min(1),
  }),
]);

export type PvsOutboxPollBody = z.infer<typeof ZPvsOutboxPollBody>;
export type PvsOutboxAckBody = z.infer<typeof ZPvsOutboxAckBody>;
