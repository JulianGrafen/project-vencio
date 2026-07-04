import type { AppointmentSyncDTO, PvsAppointmentRef } from "../types/appointment-sync.dto";

export type PvsHealthStatus = {
  ok: boolean;
  provider: string;
  message?: string;
};

export type FreeSlotsQuery = {
  teamId: number;
  from: string;
  to: string;
  eventTypeId?: number;
};

export type FreeSlot = {
  startTime: string;
  endTime: string;
  resourceId?: string;
};

/**
 * Vendor-neutral interface implemented by Dampsoft, Z1, Evident, and mock adapters.
 */
export interface PvsAdapter {
  readonly provider: string;

  healthCheck(): Promise<PvsHealthStatus>;

  getFreeSlots?(query: FreeSlotsQuery): Promise<FreeSlot[]>;

  createAppointment(dto: AppointmentSyncDTO): Promise<PvsAppointmentRef>;

  updateAppointment?(ref: PvsAppointmentRef, dto: AppointmentSyncDTO): Promise<void>;

  cancelAppointment?(ref: PvsAppointmentRef, reason?: string): Promise<void>;
}
