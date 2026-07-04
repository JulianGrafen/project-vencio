import http from "node:http";

import { afterEach, describe, expect, it } from "vitest";

import { startDampsoftBridgeServer } from "./http-server";

type HttpResult = { status: number; body: string };

function bridgeRequest(
  baseUrl: string,
  path: string,
  options: { method?: string; headers?: Record<string, string>; body?: string } = {}
): Promise<HttpResult> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method: options.method ?? "GET",
        headers: options.headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => {
          resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString("utf8") });
        });
      }
    );

    req.on("error", reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

describe("Dampsoft bridge HTTP server", () => {
  let close: (() => Promise<void>) | undefined;

  afterEach(async () => {
    if (close) {
      await close();
      close = undefined;
    }
  });

  it("serves health, create, and cancel endpoints", async () => {
    const bridge = await startDampsoftBridgeServer({ port: 0, host: "127.0.0.1", apiKey: "secret-key" });
    close = bridge.close;

    const health = await bridgeRequest(bridge.baseUrl, "/health", {
      headers: { Authorization: "Bearer secret-key" },
    });
    expect(health.status).toBe(200);

    const unauthorized = await bridgeRequest(bridge.baseUrl, "/health");
    expect(unauthorized.status).toBe(401);

    const dto = {
      bookingUid: "uid-bridge-1",
      teamId: 1,
      patientName: "Max",
      patientEmail: "max@test.de",
      startTime: "2026-07-12T10:00:00.000Z",
      endTime: "2026-07-12T10:30:00.000Z",
      title: "Kontrolle",
      source: "booker" as const,
    };

    const createResponse = await bridgeRequest(bridge.baseUrl, "/appointments", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    expect(createResponse.status).toBe(201);
    const created = JSON.parse(createResponse.body) as { externalId: string };

    const cancelResponse = await bridgeRequest(
      bridge.baseUrl,
      `/appointments/${encodeURIComponent(created.externalId)}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer secret-key" },
      }
    );

    expect(cancelResponse.status, cancelResponse.body).toBe(200);
  });
});
