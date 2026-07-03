import type { PracticeKeyResolver } from "./key-resolver";
import { isPlainObject, type WritableRecord } from "./crypto-utils";
import { encryptModelWriteData } from "./model-crypto";
import type { PracticeKeyStore, TeamLookupStore } from "./prisma-types";

type NestedRelationConfig = {
  field: string;
  model: string;
};

const NESTED_RELATIONS: NestedRelationConfig[] = [
  { field: "attendees", model: "Attendee" },
  { field: "internalNote", model: "BookingInternalNote" },
];

async function encryptNestedRelation(
  prisma: PracticeKeyStore & TeamLookupStore,
  keyResolver: PracticeKeyResolver,
  relation: WritableRecord,
  model: string
): Promise<WritableRecord> {
  const output: WritableRecord = { ...relation };

  if (Array.isArray(relation.create)) {
    output.create = await Promise.all(
      relation.create.map((entry) =>
        encryptModelWriteData(prisma, keyResolver, model, entry as WritableRecord)
      )
    );
  }

  if (isPlainObject(relation.createMany) && Array.isArray(relation.createMany.data)) {
    output.createMany = {
      ...relation.createMany,
      data: await Promise.all(
        relation.createMany.data.map((entry) =>
          encryptModelWriteData(prisma, keyResolver, model, entry as WritableRecord)
        )
      ),
    };
  }

  return output;
}

export async function encryptNestedWrites(
  prisma: PracticeKeyStore & TeamLookupStore,
  keyResolver: PracticeKeyResolver,
  data: WritableRecord
): Promise<WritableRecord> {
  const output: WritableRecord = { ...data };

  for (const { field, model } of NESTED_RELATIONS) {
    const relation = output[field];
    if (!isPlainObject(relation)) {
      continue;
    }

    output[field] = await encryptNestedRelation(prisma, keyResolver, relation, model);
  }

  return output;
}
