import type { PracticeKeyResolver } from "@calcom/lib/encryption/key-resolver";
import {
  decryptModelReadResult,
  encryptModelWriteData,
  encryptNestedWrites,
} from "@calcom/lib/encryption/record-crypto";
import { isDentalEncryptionEnabled } from "@calcom/lib/encryption/tenant-context";

import { Prisma } from "../client";

const ENCRYPTED_MODELS = new Set(["Attendee", "Booking", "BookingInternalNote", "VideoCallGuest"]);

const READ_OPERATIONS = [
  "findUnique",
  "findFirst",
  "findMany",
  "findUniqueOrThrow",
  "findFirstOrThrow",
] as const;

const WRITE_OPERATIONS = ["create", "update", "upsert", "createMany", "updateMany"] as const;

type ReadOperation = (typeof READ_OPERATIONS)[number];
type WriteOperation = (typeof WRITE_OPERATIONS)[number];

export interface FieldEncryptionExtensionDeps {
  keyResolver: PracticeKeyResolver;
  prismaForTeamLookup: {
    eventType: {
      findUnique(args: {
        where: { id: number };
        select: { teamId: true };
      }): Promise<{ teamId: number | null } | null>;
    };
    booking: {
      findUnique(args: {
        where: { id: number };
        select: { eventType: { select: { teamId: true } } };
      }): Promise<{ eventType: { teamId: number | null } | null } | null>;
    };
  };
}

function buildModelQueryHandlers(deps: FieldEncryptionExtensionDeps) {
  const handlers: Record<string, Record<string, unknown>> = {};

  for (const model of ENCRYPTED_MODELS) {
    const modelHandlers: Record<string, unknown> = {};

    for (const operation of WRITE_OPERATIONS) {
      modelHandlers[operation] = async ({
        args,
        query,
      }: {
        args: { data: Record<string, unknown> };
        query: (args: unknown) => Promise<unknown>;
      }) => {
        if (!isDentalEncryptionEnabled()) {
          return query(args);
        }

        let data = args.data;
        if (model === "Booking" && operation === "create") {
          data = await encryptNestedWrites(
            deps.prismaForTeamLookup as never,
            deps.keyResolver,
            data
          );
        }

        args.data = await encryptModelWriteData(
          deps.prismaForTeamLookup as never,
          deps.keyResolver,
          model,
          data
        );

        return query(args);
      };
    }

    for (const operation of READ_OPERATIONS) {
      modelHandlers[operation] = async ({
        args,
        query,
      }: {
        args: unknown;
        query: (args: unknown) => Promise<unknown>;
      }) => {
        const result = await query(args);
        if (!isDentalEncryptionEnabled()) {
          return result;
        }

        if (operation === "findMany" && Array.isArray(result)) {
          return Promise.all(
            result.map((entry) => decryptModelReadResult(deps.keyResolver, model, entry))
          );
        }

        return decryptModelReadResult(deps.keyResolver, model, result);
      };
    }

    handlers[model.charAt(0).toLowerCase() + model.slice(1)] = modelHandlers;
  }

  return handlers;
}

export function fieldEncryptionExtension(deps: FieldEncryptionExtensionDeps) {
  return Prisma.defineExtension({
    query: buildModelQueryHandlers(deps) as never,
  });
}

export type { ReadOperation, WriteOperation };
