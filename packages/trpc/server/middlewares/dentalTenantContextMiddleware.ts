import { TRPCError } from "@trpc/server";

import { prisma } from "@calcom/prisma";
import { inferTenantOperationFromPath } from "@calcom/lib/dental/infer-tenant-operation";
import { isDentalEncryptionEnabled } from "@calcom/lib/dental/feature-flags";
import {
  resolveTeamIdFromInput,
  type PracticeTeamLookupInput,
} from "@calcom/lib/dental/practice-team-resolver";
import { runWithTenantContextAsync } from "@calcom/lib/encryption/tenant-context";

import { middleware } from "../trpc";

async function resolveDentalTenantContext({
  input,
  userId,
  path,
}: {
  input?: PracticeTeamLookupInput;
  userId?: number;
  path: string;
}) {
  if (!input) {
    return null;
  }

  const teamId = await resolveTeamIdFromInput(prisma, input);
  if (!teamId) {
    return null;
  }

  return {
    teamId,
    operation: inferTenantOperationFromPath(path),
    actorUserId: userId,
  };
}

/**
 * Sets AsyncLocalStorage tenant context for encrypted Prisma operations.
 * Requires `teamId` on input or resolves it from `bookingId` / `eventTypeId`.
 */
export const dentalTenantContextMiddleware = middleware(async ({ ctx, input, next, path }) => {
  if (!isDentalEncryptionEnabled()) {
    return next();
  }

  const context = await resolveDentalTenantContext({
    input: input as PracticeTeamLookupInput | undefined,
    userId: ctx.user?.id,
    path,
  });

  if (!context) {
    return next();
  }

  return runWithTenantContextAsync(context, () => next());
});

/** Middleware that requires dental tenant context — fails closed if teamId cannot be resolved. */
export const dentalTenantContextRequiredMiddleware = middleware(async ({ ctx, input, next, path }) => {
  if (!isDentalEncryptionEnabled()) {
    return next();
  }

  const context = await resolveDentalTenantContext({
    input: input as PracticeTeamLookupInput | undefined,
    userId: ctx.user?.id,
    path,
  });

  if (!context) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Praxis-Kontext (teamId) konnte nicht aufgelöst werden.",
    });
  }

  return runWithTenantContextAsync(context, () => next());
});
