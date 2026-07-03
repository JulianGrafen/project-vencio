import { TRPCError } from "@trpc/server";

import { isDentalEncryptionEnabled } from "@calcom/lib/encryption/tenant-context";
import { runWithTenantContextAsync } from "@calcom/lib/encryption/tenant-context";

import { middleware } from "../trpc";

/**
 * Sets AsyncLocalStorage tenant context for encrypted Prisma operations.
 * Requires `teamId` on input or resolves it from `bookingId` / `eventTypeId`.
 */
export const dentalTenantContextMiddleware = middleware(async ({ ctx, input, next, path }) => {
  if (!isDentalEncryptionEnabled()) {
    return next();
  }

  const resolved = await resolveTeamAndOperation({
    input: input as Record<string, unknown> | undefined,
    userId: ctx.user?.id,
    path,
  });

  if (!resolved) {
    return next();
  }

  return runWithTenantContextAsync(resolved.context, () => next());
});

async function resolveTeamAndOperation({
  input,
  userId,
  path,
}: {
  input?: Record<string, unknown>;
  userId?: number;
  path: string;
}) {
  if (!input) {
    return null;
  }

  let teamId: number | null = null;

  if (typeof input.teamId === "number") {
    teamId = input.teamId;
  } else if (typeof input.eventTypeId === "number") {
    teamId = await lookupTeamIdFromEventType(input.eventTypeId);
  } else if (typeof input.bookingId === "number") {
    teamId = await lookupTeamIdFromBooking(input.bookingId);
  }

  if (!teamId) {
    return null;
  }

  const isWrite = path.includes("create") || path.includes("update") || path.includes("confirm");

  return {
    context: {
      teamId,
      operation: isWrite ? ("encrypt" as const) : ("decrypt" as const),
      actorUserId: userId,
    },
  };
}

async function lookupTeamIdFromEventType(eventTypeId: number): Promise<number | null> {
  const { prisma } = await import("@calcom/prisma");
  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    select: { teamId: true },
  });
  return eventType?.teamId ?? null;
}

async function lookupTeamIdFromBooking(bookingId: number): Promise<number | null> {
  const { prisma } = await import("@calcom/prisma");
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { eventType: { select: { teamId: true } } },
  });
  return booking?.eventType?.teamId ?? null;
}

/** Middleware that requires dental tenant context — fails closed if teamId cannot be resolved. */
export const dentalTenantContextRequiredMiddleware = middleware(async ({ ctx, input, next, path }) => {
  if (!isDentalEncryptionEnabled()) {
    return next();
  }

  const resolved = await resolveTeamAndOperation({
    input: input as Record<string, unknown> | undefined,
    userId: ctx.user?.id,
    path,
  });

  if (!resolved) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Praxis-Kontext (teamId) konnte nicht aufgelöst werden.",
    });
  }

  return runWithTenantContextAsync(resolved.context, () => next());
});
