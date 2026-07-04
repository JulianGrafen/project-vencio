import type { PvsOutboxJobDTO } from "@calcom/pvs-integration";

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
