import { prisma } from "@calcom/prisma";

import { runWithTenantContextAsync, type TenantCryptoContext } from "../encryption/tenant-context";

export async function resolvePracticeTeamIdFromEventTypeId(eventTypeId: number): Promise<number | null> {
  if (!eventTypeId) {
    return null;
  }

  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    select: { teamId: true },
  });

  return eventType?.teamId ?? null;
}

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
  const teamId = await resolvePracticeTeamIdFromEventTypeId(params.eventTypeId);
  return runWithDentalPracticeContext(
    {
      teamId,
      operation: params.operation,
      actorUserId: params.actorUserId,
    },
    handler
  );
}
