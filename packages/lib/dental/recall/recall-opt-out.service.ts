import type { PrismaClient } from "@calcom/prisma";

import { createDentalLogger } from "../resilience/dental-logger";
import { ZRecallOptOutToken } from "./recall.schemas";

export type RecallOptOutResult =
  | { success: true; patientName: string }
  | { success: false; reason: "invalid_token" | "already_opted_out" };

/**
 * DSGVO opt-out: disables recall for patient via one-click link in email.
 * Uses a transaction so recallEnabled and audit state stay consistent.
 */
export class RecallOptOutService {
  private readonly log = createDentalLogger({ module: "recall-opt-out" });

  constructor(private readonly prisma: PrismaClient) {}

  async optOutByToken(token: string): Promise<RecallOptOutResult> {
    const parsed = ZRecallOptOutToken.safeParse(token);
    if (!parsed.success) {
      return { success: false, reason: "invalid_token" };
    }

    const history = await this.prisma.recallHistory.findUnique({
      where: { optOutToken: parsed.data },
      include: { patient: { select: { id: true, name: true, recallEnabled: true } } },
    });

    if (!history) {
      return { success: false, reason: "invalid_token" };
    }

    if (!history.patient.recallEnabled) {
      return { success: false, reason: "already_opted_out" };
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.smartFillPatient.update({
          where: { id: history.patient.id },
          data: { recallEnabled: false },
        });
      });

      this.log.info("Patient opted out of recall", {
        teamId: history.teamId,
        patientId: history.patient.id,
      });

      return { success: true, patientName: history.patient.name };
    } catch (error) {
      this.log.error("Opt-out transaction failed", error, {
        patientId: history.patient.id,
      });
      return { success: false, reason: "invalid_token" };
    }
  }
}
