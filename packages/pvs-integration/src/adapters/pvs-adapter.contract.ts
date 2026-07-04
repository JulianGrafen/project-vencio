import { describe, expect, it } from "vitest";

import type { AppointmentSyncDTO } from "../types/appointment-sync.dto";
import type { PvsAdapter } from "./pvs-adapter.interface";

const sampleAppointment: AppointmentSyncDTO = {
  bookingUid: "booking-contract-test",
  teamId: 1,
  patientName: "Max Mustermann",
  patientEmail: "max@test.de",
  patientPhone: "+491701234567",
  startTime: "2026-07-12T10:00:00.000Z",
  endTime: "2026-07-12T10:30:00.000Z",
  title: "Kontrolle",
  source: "smart-fill",
};

export function runPvsAdapterContractTests(createAdapter: () => PvsAdapter): void {
  describe("PVS adapter contract", () => {
    it("reports healthy status", async () => {
      const adapter = createAdapter();
      const status = await adapter.healthCheck();

      expect(status.ok).toBe(true);
      expect(status.provider).toBe(adapter.provider);
    });

    it("creates an appointment with external reference", async () => {
      const adapter = createAdapter();
      const ref = await adapter.createAppointment(sampleAppointment);

      expect(ref.externalId).toBeTruthy();
      expect(ref.provider).toBe(adapter.provider);
    });
  });
}
