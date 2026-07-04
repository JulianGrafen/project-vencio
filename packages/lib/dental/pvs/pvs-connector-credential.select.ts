import type { Prisma } from "@calcom/prisma";

export const PVS_CONNECTOR_CREDENTIAL_SELECT = {
  id: true,
  label: true,
  keyPrefix: true,
  isActive: true,
  lastUsedAt: true,
  createdAt: true,
  revokedAt: true,
} as const satisfies Prisma.PvsConnectorCredentialSelect;

export type PvsConnectorCredentialListItem = Prisma.PvsConnectorCredentialGetPayload<{
  select: typeof PVS_CONNECTOR_CREDENTIAL_SELECT;
}>;
