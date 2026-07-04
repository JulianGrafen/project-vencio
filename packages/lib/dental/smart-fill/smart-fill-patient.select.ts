import type { Prisma } from "@calcom/prisma/generated/prisma/client";

export const SMART_FILL_PATIENT_SELECT = {
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
  waitlistEnabled: true,
  lastVisitAt: true,
  priorityScore: true,
  preferredEventTypeId: true,
  createdAt: true,
} as const satisfies Prisma.SmartFillPatientSelect;

export type SmartFillPatientListItem = Prisma.SmartFillPatientGetPayload<{
  select: typeof SMART_FILL_PATIENT_SELECT;
}>;
