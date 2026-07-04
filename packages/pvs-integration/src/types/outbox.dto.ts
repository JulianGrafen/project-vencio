import type { AppointmentSyncDTO } from "./appointment-sync.dto";

export type PvsOutboxJobDTO = {
  id: string;
  teamId: number;
  bookingUid: string;
  operation: "CREATE_APPOINTMENT" | "UPDATE_APPOINTMENT" | "CANCEL_APPOINTMENT";
  payload: AppointmentSyncDTO | Record<string, unknown>;
  /** Present when payload is a sealed stub — decrypt with practice private key on-premise. */
  encryptedPayload?: string;
  payloadVersion?: number;
  attempts: number;
  createdAt: string;
};

export type PvsOutboxPollResult = {
  jobs: PvsOutboxJobDTO[];
};

export type PvsOutboxAckInput = {
  teamId: number;
  outboxId: string;
  status: "COMPLETED" | "FAILED";
  externalId?: string;
  error?: string;
};

export type PvsOutboxAckResult = {
  outboxId: string;
  status: "COMPLETED" | "FAILED" | "PENDING";
  attempts: number;
  nextRetryAt?: string;
};
