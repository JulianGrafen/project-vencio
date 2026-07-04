import type { AppointmentSyncDTO } from "@calcom/pvs-integration";
import { randomUUID } from "node:crypto";

export type StoredDampsoftAppointment = {
  externalId: string;
  dto: AppointmentSyncDTO;
  cancelledAt?: Date;
  cancellationReason?: string;
};

export class DampsoftBridgeStore {
  private readonly appointments = new Map<string, StoredDampsoftAppointment>();

  create(dto: AppointmentSyncDTO): StoredDampsoftAppointment {
    const externalId = `ds-${dto.bookingUid.slice(0, 12)}-${randomUUID().slice(0, 6)}`;
    const record: StoredDampsoftAppointment = { externalId, dto };
    this.appointments.set(externalId, record);
    return record;
  }

  cancel(externalId: string, reason?: string): StoredDampsoftAppointment | null {
    const record = this.appointments.get(externalId);
    if (!record || record.cancelledAt) {
      return null;
    }

    record.cancelledAt = new Date();
    record.cancellationReason = reason;
    return record;
  }

  get(externalId: string): StoredDampsoftAppointment | undefined {
    return this.appointments.get(externalId);
  }

  list(): StoredDampsoftAppointment[] {
    return [...this.appointments.values()];
  }

  clear(): void {
    this.appointments.clear();
  }
}
