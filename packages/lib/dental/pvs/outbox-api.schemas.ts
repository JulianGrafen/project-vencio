import { z } from "zod";

export const ZPvsOutboxPollBody = z.object({
  teamId: z.number().int().positive(),
  limit: z.number().int().min(1).max(50).optional(),
});

export const ZPvsOutboxAckBody = z
  .object({
    teamId: z.number().int().positive(),
    outboxId: z.string().min(1),
    status: z.enum(["COMPLETED", "FAILED"]),
    externalId: z.string().min(1).optional(),
    error: z.string().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.status === "COMPLETED" && !value.externalId) {
      ctx.addIssue({
        code: "custom",
        message: "externalId is required when status is COMPLETED",
        path: ["externalId"],
      });
    }
    if (value.status === "FAILED" && !value.error) {
      ctx.addIssue({
        code: "custom",
        message: "error is required when status is FAILED",
        path: ["error"],
      });
    }
  });

export type PvsOutboxPollBody = z.infer<typeof ZPvsOutboxPollBody>;
export type PvsOutboxAckBody = z.infer<typeof ZPvsOutboxAckBody>;
