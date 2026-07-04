import { randomUUID } from "node:crypto";

import { prisma } from "@calcom/prisma";
import { RecallChannel, RecallHistoryStatus } from "@calcom/prisma/enums";

export type SeedRecallOptOutParams = {
  teamId: number;
  optOutToken?: string;
  recallEnabled?: boolean;
  patientName?: string;
};

export async function seedRecallOptOut(params: SeedRecallOptOutParams) {
  const optOutToken = params.optOutToken ?? randomUUID();
  const phoneBlindIndex = `e2e-recall-${randomUUID().slice(0, 8)}`;
  const recallDueDate = new Date("2026-07-04T00:00:00.000Z");

  const patient = await prisma.smartFillPatient.create({
    data: {
      teamId: params.teamId,
      name: params.patientName ?? "E2E Recall Patient",
      email: "e2e-recall@example.com",
      phoneNumber: "+491709876543",
      phoneBlindIndex,
      recallEnabled: params.recallEnabled ?? true,
      lastVisitAt: new Date("2026-01-04T00:00:00.000Z"),
    },
  });

  const history = await prisma.recallHistory.create({
    data: {
      teamId: params.teamId,
      patientId: patient.id,
      channel: RecallChannel.EMAIL,
      status: RecallHistoryStatus.SENT,
      recallDueDate,
      optOutToken,
      sentAt: new Date(),
    },
  });

  return { patient, history, optOutToken };
}
