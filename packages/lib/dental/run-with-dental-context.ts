import { prisma } from "@calcom/prisma";

import { runWithTenantContextAsync, type TenantCryptoContext } from "../encryption/tenant-context";
import { resolveTeamIdFromEventTypeId } from "./practice-team-resolver";

export async function runWithDentalPracticeContext<T>(
  params: {
    teamId: number | null | undefined;
    operation: TenantCryptoContext["operation"];
    actorUserId?: number;
  },
  handler: () => Promise<T>
): Promise<T> {
  if (!params.teamId) {
    return handler();
  }

  return runWithTenantContextAsync(
    {
      teamId: params.teamId,
      operation: params.operation,
      actorUserId: params.actorUserId,
    },
    handler
  );
}

export async function runWithDentalPracticeContextForEventType<T>(
  params: {
    eventTypeId: number;
    operation: TenantCryptoContext["operation"];
    actorUserId?: number;
  },
  handler: () => Promise<T>
): Promise<T> {
  const teamId = await resolveTeamIdFromEventTypeId(prisma, params.eventTypeId);
  return runWithDentalPracticeContext(
    {
      teamId,
      operation: params.operation,
      actorUserId: params.actorUserId,
    },
    handler
  );
}
