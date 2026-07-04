import type { AppointmentSyncDTO, PvsAppointmentRef } from "../types/appointment-sync.dto";
import type { PvsAdapter, PvsHealthStatus } from "./pvs-adapter.interface";

export class MockPvsAdapter implements PvsAdapter {
  readonly provider = "mock";

  async healthCheck(): Promise<PvsHealthStatus> {
    return { ok: true, provider: this.provider };
  }

  async createAppointment(dto: AppointmentSyncDTO): Promise<PvsAppointmentRef> {
    return {
      externalId: `mock-${dto.bookingUid}`,
      provider: this.provider,
    };
  }
}
