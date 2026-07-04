import type { AppointmentSyncDTO, PvsAppointmentRef } from "../types/appointment-sync.dto";
import type { PvsAdapter, PvsHealthStatus } from "./pvs-adapter.interface";

/**
 * Stub adapter for Dampsoft PVS — real DB/API wiring lives in the local connector.
 */
export class DampsoftPvsAdapter implements PvsAdapter {
  readonly provider = "dampsoft";

  constructor(private readonly options?: { simulateFailure?: boolean }) {}

  async healthCheck(): Promise<PvsHealthStatus> {
    if (this.options?.simulateFailure) {
      return { ok: false, provider: this.provider, message: "Dampsoft unreachable (stub)" };
    }
    return { ok: true, provider: this.provider, message: "Dampsoft stub ready" };
  }

  async createAppointment(dto: AppointmentSyncDTO): Promise<PvsAppointmentRef> {
    if (this.options?.simulateFailure) {
      throw new Error("Dampsoft createAppointment failed (stub)");
    }

    return {
      externalId: `ds-${dto.bookingUid.slice(0, 12)}`,
      provider: this.provider,
    };
  }
}
