import type { PrismaClient } from "@calcom/prisma";
import { PvsSyncOutboxStatus } from "@calcom/prisma/enums";

import type {
  AppointmentSyncDTO,
  PvsOutboxAckResult,
  PvsOutboxJobDTO,
  PvsOutboxPollResult,
} from "@calcom/pvs-integration";

import {
  PVS_OUTBOX_ERROR_MAX_LENGTH,
  PVS_OUTBOX_MAX_ATTEMPTS,
  PVS_OUTBOX_POLL_DEFAULT_LIMIT,
  PVS_OUTBOX_POLL_MAX_LIMIT,
  PVS_OUTBOX_RETRY_BASE_MS,
} from "./pvs-outbox.constants";
import { PVS_OUTBOX_JOB_POLL_SELECT, type PvsOutboxJobPollRow } from "./pvs-outbox.select";

function computeNextRetryAt(attempts: number): Date {
  const exponent = Math.max(0, attempts - 1);
  const delayMs = PVS_OUTBOX_RETRY_BASE_MS * 2 ** exponent;
  return new Date(Date.now() + delayMs);
}

function toJobDto(row: PvsOutboxJobPollRow): PvsOutboxJobDTO {
  return {
    id: row.id,
    teamId: row.teamId,
    bookingUid: row.bookingUid,
    operation: row.operation,
    payload: row.payload as AppointmentSyncDTO,
    attempts: row.attempts,
    createdAt: row.createdAt.toISOString(),
  };
}

export class PvsOutboxNotFoundError extends Error {
  readonly statusCode = 404;

  constructor(outboxId: string) {
    super(`PVS outbox job not found: ${outboxId}`);
    this.name = "PvsOutboxNotFoundError";
  }
}

export class PvsOutboxService {
  constructor(private readonly prisma: PrismaClient) {}

  async pollPending(
    teamId: number,
    limit = PVS_OUTBOX_POLL_DEFAULT_LIMIT
  ): Promise<PvsOutboxPollResult> {
    const now = new Date();
    const safeLimit = Math.min(Math.max(1, limit), PVS_OUTBOX_POLL_MAX_LIMIT);

    const candidates = await this.prisma.pvsSyncOutbox.findMany({
      where: {
        teamId,
        status: PvsSyncOutboxStatus.PENDING,
        nextRetryAt: { lte: now },
      },
      orderBy: { createdAt: "asc" },
      take: safeLimit,
      select: PVS_OUTBOX_JOB_POLL_SELECT,
    });

    if (candidates.length === 0) {
      return { jobs: [] };
    }

    const candidateIds = candidates.map((row) => row.id);

    await this.prisma.pvsSyncOutbox.updateMany({
      where: {
        id: { in: candidateIds },
        status: PvsSyncOutboxStatus.PENDING,
      },
      data: {
        status: PvsSyncOutboxStatus.PROCESSING,
        attempts: { increment: 1 },
      },
    });

    const claimed = await this.prisma.pvsSyncOutbox.findMany({
      where: {
        id: { in: candidateIds },
        teamId,
        status: PvsSyncOutboxStatus.PROCESSING,
      },
      select: PVS_OUTBOX_JOB_POLL_SELECT,
    });

    return { jobs: claimed.map(toJobDto) };
  }

  async acknowledgeCompleted(
    teamId: number,
    outboxId: string,
    externalId: string
  ): Promise<PvsOutboxAckResult> {
    const row = await this.requireProcessingJob(teamId, outboxId);

    const updated = await this.prisma.pvsSyncOutbox.update({
      where: { id: row.id },
      data: {
        status: PvsSyncOutboxStatus.COMPLETED,
        externalId,
        lastError: null,
      },
      select: { id: true, status: true, attempts: true },
    });

    return {
      outboxId: updated.id,
      status: "COMPLETED",
      attempts: updated.attempts,
    };
  }

  async acknowledgeFailed(
    teamId: number,
    outboxId: string,
    error: string
  ): Promise<PvsOutboxAckResult> {
    const row = await this.requireProcessingJob(teamId, outboxId);
    const isFinalFailure = row.attempts >= PVS_OUTBOX_MAX_ATTEMPTS;
    const nextRetryAt = isFinalFailure ? row.nextRetryAt : computeNextRetryAt(row.attempts);

    const updated = await this.prisma.pvsSyncOutbox.update({
      where: { id: row.id },
      data: {
        status: isFinalFailure ? PvsSyncOutboxStatus.FAILED : PvsSyncOutboxStatus.PENDING,
        lastError: error.slice(0, PVS_OUTBOX_ERROR_MAX_LENGTH),
        nextRetryAt,
      },
      select: { id: true, status: true, attempts: true, nextRetryAt: true },
    });

    return {
      outboxId: updated.id,
      status: isFinalFailure ? "FAILED" : "PENDING",
      attempts: updated.attempts,
      nextRetryAt: updated.nextRetryAt.toISOString(),
    };
  }

  private async requireProcessingJob(teamId: number, outboxId: string) {
    const row = await this.prisma.pvsSyncOutbox.findFirst({
      where: { id: outboxId, teamId, status: PvsSyncOutboxStatus.PROCESSING },
      select: { id: true, attempts: true, nextRetryAt: true },
    });

    if (!row) {
      throw new PvsOutboxNotFoundError(outboxId);
    }

    return row;
  }
}
