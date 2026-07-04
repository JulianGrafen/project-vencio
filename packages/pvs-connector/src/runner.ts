import type { PvsOutboxJobDTO } from "@calcom/pvs-integration";
import type { AppointmentSyncDTO } from "@calcom/pvs-integration";
import { DampsoftPvsAdapter } from "@calcom/pvs-integration";

export type PvsConnectorPollResponse = {
  jobs: PvsOutboxJobDTO[];
};

export type PvsConnectorAckPayload = {
  teamId: number;
  outboxId: string;
  status: "COMPLETED" | "FAILED";
  externalId?: string;
  error?: string;
};

export type PvsConnectorClientConfig = {
  baseUrl: string;
  apiKey: string;
  teamId: number;
  pollLimit?: number;
};

export class PvsConnectorClient {
  constructor(private readonly config: PvsConnectorClientConfig) {}

  async poll(): Promise<PvsOutboxJobDTO[]> {
    const response = await fetch(`${this.config.baseUrl}/api/pvs/outbox/poll`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: this.config.teamId,
        limit: this.config.pollLimit ?? 10,
      }),
    });

    if (!response.ok) {
      throw new Error(`Poll failed: ${response.status} ${await response.text()}`);
    }

    const body = (await response.json()) as PvsConnectorPollResponse;
    return body.jobs;
  }

  async ack(payload: PvsConnectorAckPayload): Promise<void> {
    const response = await fetch(`${this.config.baseUrl}/api/pvs/outbox/ack`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Ack failed: ${response.status} ${await response.text()}`);
    }
  }
}

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
