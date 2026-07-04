import type { PvsAdapter } from "@calcom/pvs-integration";
import type { PvsOutboxJobDTO } from "@calcom/pvs-integration";
import { DampsoftPvsAdapter, parseOutboxJob, resolvePvsAppointmentRef } from "@calcom/pvs-integration";
import { PvsSyncOperation } from "@calcom/prisma/enums";

import { PvsConnectorClient } from "./client";
import { getPvsAdapterCircuitBreaker } from "./resilience";

export type PvsConnectorRunnerOptions = {
  client: PvsConnectorClient;
  adapter?: PvsAdapter;
  onJobProcessed?: (jobId: string, status: "COMPLETED" | "FAILED") => void;
};

export async function processPvsOutboxJob(
  job: PvsOutboxJobDTO,
  adapter: PvsAdapter
): Promise<{ status: "COMPLETED" | "FAILED"; externalId?: string; error?: string }> {
  const validated = parseOutboxJob(job);
  if (!validated.ok) {
    return { status: "FAILED", error: validated.error };
  }

  const payload = validated.payload;
  const breaker = getPvsAdapterCircuitBreaker();

  try {
    return await breaker.execute(async () => {
      switch (job.operation) {
        case PvsSyncOperation.CANCEL_APPOINTMENT: {
          if (adapter.cancelAppointment) {
            await adapter.cancelAppointment(
              resolvePvsAppointmentRef(payload, adapter.provider),
              payload.cancellationReason
            );
          }
          return { status: "COMPLETED" as const, externalId: `cancel-${payload.bookingUid}` };
        }

        case PvsSyncOperation.UPDATE_APPOINTMENT: {
          if (adapter.updateAppointment) {
            await adapter.updateAppointment(
              resolvePvsAppointmentRef(payload, adapter.provider),
              payload
            );
          }
          return { status: "COMPLETED" as const, externalId: `update-${payload.bookingUid}` };
        }

        default: {
          const ref = await adapter.createAppointment(payload);
          return { status: "COMPLETED" as const, externalId: ref.externalId };
        }
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === "circuit_open") {
      console.error("[PVS] Circuit breaker OPEN — adapter calls halted after repeated failures");
    }
    return { status: "FAILED", error: message };
  }
}

export async function runPvsConnectorOnce(options: PvsConnectorRunnerOptions): Promise<number> {
  const adapter = options.adapter ?? new DampsoftPvsAdapter();
  const jobs = await options.client.poll();
  let processed = 0;

  for (const job of jobs) {
    const result = await processPvsOutboxJob(job, adapter);
    await options.client.ack({
      teamId: job.teamId,
      outboxId: job.id,
      status: result.status,
      externalId: result.externalId,
      error: result.error,
    });
    options.onJobProcessed?.(job.id, result.status);
    processed += 1;
  }

  return processed;
}

export { PvsConnectorClient } from "./client";
export type { PvsConnectorAckPayload, PvsConnectorClientConfig } from "./client";
