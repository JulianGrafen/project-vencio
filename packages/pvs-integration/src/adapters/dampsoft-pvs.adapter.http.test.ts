import { describe, expect, it, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

import { DampsoftPvsAdapter } from "./dampsoft-pvs.adapter";

const fetchMocker = createFetchMock(vi);

describe("DampsoftPvsAdapter HTTP mode", () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
    fetchMocker.enableMocks();
  });

  it("creates appointment via HTTP bridge response", async () => {
    fetchMocker.mockResponseOnce(JSON.stringify({ ok: true }), { status: 200 });
    fetchMocker.mockResponseOnce(JSON.stringify({ externalId: "ds-http-1", provider: "dampsoft" }), {
      status: 201,
    });

    const adapter = new DampsoftPvsAdapter({ apiBaseUrl: "http://127.0.0.1:8090", apiKey: "secret" });
    const health = await adapter.healthCheck();
    expect(health.ok).toBe(true);

    const ref = await adapter.createAppointment({
      bookingUid: "uid-http-1",
      teamId: 1,
      patientName: "Anna",
      patientEmail: "anna@test.de",
      startTime: "2026-07-12T10:00:00.000Z",
      endTime: "2026-07-12T10:30:00.000Z",
      title: "Kontrolle",
      source: "booker",
    });

    expect(ref.externalId).toBe("ds-http-1");
    expect(fetchMocker.requests()[1]?.url).toContain("/appointments");
  });

  it("cancels appointment via HTTP DELETE", async () => {
    fetchMocker.mockResponseOnce(JSON.stringify({ cancelled: true }), { status: 200 });

    const adapter = new DampsoftPvsAdapter({ apiBaseUrl: "http://127.0.0.1:8090" });
    await adapter.cancelAppointment({ externalId: "ds-99", provider: "dampsoft" }, "Abgesagt");

    expect(fetchMocker.requests()[0]?.method).toBe("DELETE");
  });
});
