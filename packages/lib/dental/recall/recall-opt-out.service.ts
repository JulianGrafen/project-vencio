import type { PrismaClient } from "@calcom/prisma";

export type RecallOptOutResult =
  | { success: true; patientName: string }
  | { success: false; reason: "invalid_token" | "already_opted_out" };

/**
 * DSGVO opt-out: disables recall for patient via one-click link in email.
 */
export class RecallOptOutService {
  constructor(private readonly prisma: PrismaClient) {}

  async optOutByToken(token: string): Promise<RecallOptOutResult> {
    const history = await this.prisma.recallHistory.findUnique({
      where: { optOutToken: token },
      include: { patient: { select: { id: true, name: true, recallEnabled: true } } },
    });

    if (!history) {
      return { success: false, reason: "invalid_token" };
    }

    if (!history.patient.recallEnabled) {
      return { success: false, reason: "already_opted_out" };
    }

    await this.prisma.smartFillPatient.update({
      where: { id: history.patient.id },
      data: { recallEnabled: false },
    });

    return { success: true, patientName: history.patient.name };
  }
}
