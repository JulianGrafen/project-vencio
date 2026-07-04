import type { PrismaClient } from "@calcom/prisma";
import { type RecallChannel, RecallHistoryStatus } from "@calcom/prisma/enums";

const ACTIVE_RECALL_STATUSES = [RecallHistoryStatus.SENT, RecallHistoryStatus.PENDING] as const;

export type CreateRecallHistoryInput = {
  teamId: number;
  patientId: string;
  channel: RecallChannel;
  recallDueDate: Date;
  optOutToken?: string;
};

/**
 * Persists and queries RecallHistory rows — single place for dedup and status updates.
 */
export class RecallHistoryService {
  constructor(private readonly prisma: PrismaClient) {}

  async hasActiveRecall(params: {
    patientId: string;
    recallDueDate: Date;
    channel?: RecallChannel;
  }): Promise<boolean> {
    const where: {
      patientId: string;
      recallDueDate: Date;
      channel?: RecallChannel;
      status: { in: typeof ACTIVE_RECALL_STATUSES };
    } = {
      patientId: params.patientId,
      recallDueDate: params.recallDueDate,
      status: { in: [...ACTIVE_RECALL_STATUSES] },
    };

    if (params.channel) {
      where.channel = params.channel;
    }

    const existing = await this.prisma.recallHistory.findFirst({
      where,
      select: { id: true },
    });

    return existing !== null;
  }

  async createPending(input: CreateRecallHistoryInput): Promise<string> {
    const history = await this.prisma.recallHistory.create({
      data: {
        teamId: input.teamId,
        patientId: input.patientId,
        channel: input.channel,
        status: RecallHistoryStatus.PENDING,
        recallDueDate: input.recallDueDate,
        optOutToken: input.optOutToken,
      },
      select: { id: true },
    });

    return history.id;
  }

  async markSent(historyId: string): Promise<void> {
    await this.prisma.recallHistory.update({
      where: { id: historyId },
      data: { status: RecallHistoryStatus.SENT, sentAt: new Date(), error: null },
    });
  }

  async markFailed(historyId: string, message: string): Promise<void> {
    await this.prisma.recallHistory.update({
      where: { id: historyId },
      data: { status: RecallHistoryStatus.FAILED, error: message.slice(0, 2000) },
    });
  }
}
