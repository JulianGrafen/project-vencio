import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";

import type { AppointmentSyncDTO } from "@calcom/pvs-integration";

import { DampsoftBridgeStore } from "./store";

export type DampsoftBridgeServerOptions = {
  port: number;
  host?: string;
  apiKey?: string;
  store?: DampsoftBridgeStore;
};

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  if (chunks.length === 0) {
    return undefined;
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function isAuthorized(req: IncomingMessage, apiKey?: string): boolean {
  if (!apiKey) {
    return true;
  }

  return req.headers.authorization === `Bearer ${apiKey}`;
}

function parseAppointmentDto(body: unknown): AppointmentSyncDTO | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const dto = body as AppointmentSyncDTO;
  if (!dto.bookingUid?.trim() || !dto.patientEmail?.trim()) {
    return null;
  }

  return dto;
}

export function createDampsoftBridgeServer(options: DampsoftBridgeServerOptions): {
  server: Server;
  store: DampsoftBridgeStore;
  baseUrl: string;
} {
  const store = options.store ?? new DampsoftBridgeStore();
  const host = options.host ?? "127.0.0.1";
  const baseUrl = `http://${host}:${options.port}`;

  const server = createServer(async (req, res) => {
    if (!req.url || !req.method) {
      sendJson(res, 400, { error: "invalid_request" });
      return;
    }

    if (!isAuthorized(req, options.apiKey)) {
      sendJson(res, 401, { error: "unauthorized" });
      return;
    }

    const pathname = req.url.split("?")[0] ?? "/";

    if (req.method === "GET" && pathname === "/health") {
      sendJson(res, 200, {
        ok: true,
        provider: "dampsoft-bridge",
        appointments: store.list().length,
      });
      return;
    }

    if (req.method === "POST" && pathname === "/appointments") {
      try {
        const body = await readJsonBody(req);
        const dto = parseAppointmentDto(body);
        if (!dto) {
          sendJson(res, 400, { error: "invalid_appointment_payload" });
          return;
        }

        const record = store.create(dto);
        sendJson(res, 201, { externalId: record.externalId, provider: "dampsoft" });
      } catch {
        sendJson(res, 400, { error: "invalid_json" });
      }
      return;
    }

    const cancelMatch = pathname.match(/^\/appointments\/([^/]+)$/);
    if (req.method === "DELETE" && cancelMatch) {
      try {
        const body = (await readJsonBody(req)) as { reason?: string } | undefined;
        const externalId = decodeURIComponent(cancelMatch[1] ?? "");
        const record = store.cancel(externalId, body?.reason);
        if (!record) {
          sendJson(res, 404, { error: "appointment_not_found" });
          return;
        }

        sendJson(res, 200, { externalId, cancelled: true });
      } catch {
        sendJson(res, 400, { error: "invalid_json" });
      }
      return;
    }

    sendJson(res, 404, { error: "not_found" });
  });

  return { server, store, baseUrl };
}

export function startDampsoftBridgeServer(options: DampsoftBridgeServerOptions): Promise<{
  server: Server;
  store: DampsoftBridgeStore;
  baseUrl: string;
  close: () => Promise<void>;
}> {
  const created = createDampsoftBridgeServer(options);
  const host = options.host ?? "127.0.0.1";

  return new Promise((resolve, reject) => {
    created.server.once("error", reject);
    created.server.listen(options.port, host, () => {
      const address = created.server.address();
      const resolvedPort =
        typeof address === "object" && address?.port ? address.port : options.port;
      const resolvedBaseUrl = `http://${host}:${resolvedPort}`;

      resolve({
        server: created.server,
        store: created.store,
        baseUrl: resolvedBaseUrl,
        close: () =>
          new Promise((closeResolve, closeReject) => {
            created.server.close((error) => (error ? closeReject(error) : closeResolve()));
          }),
      });
    });
  });
}
