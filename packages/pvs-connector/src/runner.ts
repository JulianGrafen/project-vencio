import type { PvsOutboxJobDTO } from "@calcom/pvs-integration";
import type { AppointmentSyncDTO } from "@calcom/pvs-integration";
import { DampsoftPvsAdapter } from "@calcom/pvs-integration";

import { PvsConnectorClient } from "./client";

export type PvsConnectorRunnerOptions = {
  client: PvsConnectorClient;
  adapter?: DampsoftPvsAdapter;
  onJobProcessed?: (jobId: string, status: "COMPLETED" | "FAILED") => void;
};

export async function processPvsOutboxJob(
  job: PvsOutboxJobDTO,
  adapter: DampsoftPvsAdapter
): Promise<{ status: "COMPLETED" | "FAILED"; externalId?: string; error?: string }> {
  const payload = job.payload as AppointmentSyncDTO;

  try {
    if (job.operation === "CANCEL_APPOINTMENT") {
      if (adapter.cancelAppointment) {
        await adapter.cancelAppointment(
          { externalId: payload.bookingUid, provider: adapter.provider },
          payload.cancellationReason
        );
      }
      return { status: "COMPLETED", externalId: `cancel-${payload.bookingUid}` };
    }

    if (job.operation === "UPDATE_APPOINTMENT") {
      if (adapter.updateAppointment) {
        await adapter.updateAppointment(
          { externalId: payload.bookingUid, provider: adapter.provider },
          payload
        );
      }
      return { status: "COMPLETED", externalId: `update-${payload.bookingUid}` };
    }

    const ref = await adapter.createAppointment(payload);
    return { status: "COMPLETED", externalId: ref.externalId };
  } catch (error) {
    return {
      status: "FAILED",
      error: error instanceof Error ? error.message : String(error),
    };
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
