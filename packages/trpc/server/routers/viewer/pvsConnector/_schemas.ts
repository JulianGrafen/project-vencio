import { z } from "zod";

export const ZPvsConnectorListInput = z.object({
  teamId: z.number().int().positive(),
});

export const ZPvsConnectorCreateInput = z.object({
  teamId: z.number().int().positive(),
  label: z.string().trim().min(1).max(64).default("default"),
});

export const ZPvsConnectorRevokeInput = z.object({
  teamId: z.number().int().positive(),
  credentialId: z.string().min(1),
});

export type TPvsConnectorListInput = z.infer<typeof ZPvsConnectorListInput>;
export type TPvsConnectorCreateInput = z.infer<typeof ZPvsConnectorCreateInput>;
export type TPvsConnectorRevokeInput = z.infer<typeof ZPvsConnectorRevokeInput>;
