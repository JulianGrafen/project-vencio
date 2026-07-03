import type { PracticeKeyResolver } from "@calcom/lib/encryption/key-resolver";
import {
  decryptModelReadResult,
  encryptModelWriteData,
  encryptNestedWrites,
} from "@calcom/lib/encryption/record-crypto";
import { isPlainObject, type WritableRecord } from "@calcom/lib/encryption/crypto-utils";
import { isDentalEncryptionEnabled } from "@calcom/lib/dental/feature-flags";

import { Prisma } from "../client";

const ENCRYPTED_MODELS = ["Attendee", "Booking", "BookingInternalNote", "VideoCallGuest"] as const;

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

function toModelKey(model: string): string {
  return model.charAt(0).toLowerCase() + model.slice(1);
}

async function encryptWritePayload(
  deps: FieldEncryptionExtensionDeps,
  model: string,
  operation: WriteOperation,
  args: Record<string, unknown>
): Promise<void> {
  if (operation === "upsert") {
    if (isPlainObject(args.create)) {
      if (model === "Booking") {
        args.create = await encryptNestedWrites(
          deps.prismaForTeamLookup as never,
          deps.keyResolver,
          args.create
        );
      }
      args.create = await encryptModelWriteData(
        deps.prismaForTeamLookup as never,
        deps.keyResolver,
        model,
        args.create as WritableRecord
      );
    }
    if (isPlainObject(args.update)) {
      args.update = await encryptModelWriteData(
        deps.prismaForTeamLookup as never,
        deps.keyResolver,
        model,
        args.update as WritableRecord
      );
    }
    return;
  }

  if (operation === "createMany" && Array.isArray(args.data)) {
    args.data = await Promise.all(
      args.data.map((row) =>
        encryptModelWriteData(
          deps.prismaForTeamLookup as never,
          deps.keyResolver,
          model,
          row as Record<string, unknown>
        )
      )
    );
    return;
  }

  if (!isPlainObject(args.data)) {
    return;
  }

  if (model === "Booking" && operation === "create") {
    args.data = await encryptNestedWrites(
      deps.prismaForTeamLookup as never,
      deps.keyResolver,
      args.data
    );
  }

  args.data = await encryptModelWriteData(
    deps.prismaForTeamLookup as never,
    deps.keyResolver,
    model,
    args.data as WritableRecord
  );
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
        args: Record<string, unknown>;
        query: (args: unknown) => Promise<unknown>;
      }) => {
        if (!isDentalEncryptionEnabled()) {
          return query(args);
        }

        await encryptWritePayload(deps, model, operation, args);
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

    handlers[toModelKey(model)] = modelHandlers;
  }

  return handlers;
}

export function fieldEncryptionExtension(deps: FieldEncryptionExtensionDeps) {
  return Prisma.defineExtension({
    query: buildModelQueryHandlers(deps) as never,
  });
}

export type { ReadOperation, WriteOperation };
