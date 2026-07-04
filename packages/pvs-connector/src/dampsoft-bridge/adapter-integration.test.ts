import http from "node:http";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DampsoftPvsAdapter } from "@calcom/pvs-integration";

import { resetPvsCircuitBreakerForTests } from "../resilience";
import { processPvsOutboxJob } from "../runner";
import { startDampsoftBridgeServer } from "./http-server";

/** Real HTTP fetch for localhost — vitest-fetch-mock returns empty bodies otherwise. */
function fetchViaNodeHttp(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    const url = new URL(typeof input === "string" ? input : input.toString());
    const headers = Object.fromEntries(new Headers(init?.headers).entries());

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method: init?.method ?? "GET",
        headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          resolve(
            new Response(body, {
              status: res.statusCode ?? 500,
              headers: res.headers as HeadersInit,
            })
          );
        });
      }
    );

    req.on("error", reject);
    if (init?.body) {
      const body =
        typeof init.body === "string" ? init.body : init.body instanceof Buffer ? init.body.toString("utf8") : String(init.body);
      req.setHeader("Content-Length", Buffer.byteLength(body));
      req.write(body);
    }
    req.end();
  });
}

const appointmentPayload = {
  bookingUid: "uid-bridge-integration",
  teamId: 7,
  patientName: "Anna",
  patientEmail: "anna@test.de",
  startTime: "2026-07-12T10:00:00.000Z",
  endTime: "2026-07-12T10:30:00.000Z",
  title: "Kontrolle",
  source: "booker" as const,
};

describe("Dampsoft bridge + adapter + connector runner", () => {
  let close: (() => Promise<void>) | undefined;

  beforeEach(() => {
    resetPvsCircuitBreakerForTests();
    vi.stubGlobal("fetch", fetchViaNodeHttp);
  });

  afterEach(async () => {
    vi.unstubAllGlobals();
    if (close) {
      await close();
      close = undefined;
    }
  });

  it("creates and cancels appointments through the live HTTP bridge", async () => {
    const bridge = await startDampsoftBridgeServer({
      port: 0,
      host: "127.0.0.1",
      apiKey: "integration-secret",
    });
    close = bridge.close;

    const adapter = new DampsoftPvsAdapter({
      apiBaseUrl: bridge.baseUrl,
      apiKey: "integration-secret",
    });

    const health = await adapter.healthCheck();
    expect(health.ok).toBe(true);

    const createResult = await processPvsOutboxJob(
      {
        id: "job-create-bridge",
        teamId: appointmentPayload.teamId,
        bookingUid: appointmentPayload.bookingUid,
        operation: "CREATE_APPOINTMENT",
        payload: appointmentPayload,
        attempts: 1,
        createdAt: new Date().toISOString(),
      },
      adapter
    );

    expect(createResult.status, createResult.error).toBe("COMPLETED");
    expect(createResult.externalId).toMatch(/^ds-/);
    expect(bridge.store.get(createResult.externalId!)?.cancelledAt).toBeUndefined();

    const cancelResult = await processPvsOutboxJob(
      {
        id: "job-cancel-bridge",
        teamId: appointmentPayload.teamId,
        bookingUid: appointmentPayload.bookingUid,
        operation: "CANCEL_APPOINTMENT",
        payload: {
          ...appointmentPayload,
          pvsExternalId: createResult.externalId,
          cancellationReason: "Patient abgesagt",
        },
        attempts: 1,
        createdAt: new Date().toISOString(),
      },
      adapter
    );

    expect(cancelResult.status, cancelResult.error).toBe("COMPLETED");
    expect(bridge.store.get(createResult.externalId!)?.cancelledAt).toBeInstanceOf(Date);
  });
});
