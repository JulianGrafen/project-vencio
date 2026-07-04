#!/usr/bin/env node
import process from "node:process";

import { startDampsoftBridgeServer } from "./dampsoft-bridge/http-server";

async function main() {
  const port = Number(process.env.DAMPSOFT_BRIDGE_PORT ?? "8090");
  const host = process.env.DAMPSOFT_BRIDGE_HOST ?? "127.0.0.1";
  const apiKey = process.env.DAMPSOFT_PVS_API_KEY?.trim() || undefined;

  if (!port || Number.isNaN(port)) {
    throw new Error("DAMPSOFT_BRIDGE_PORT must be a valid port number");
  }

  const bridge = await startDampsoftBridgeServer({ port, host, apiKey });

  console.info(`Dampsoft bridge listening on ${bridge.baseUrl}`);
  console.info("Endpoints: GET /health, POST /appointments, DELETE /appointments/:externalId");
  if (apiKey) {
    console.info("Auth: Bearer DAMPSOFT_PVS_API_KEY required");
  }

  const shutdown = async () => {
    await bridge.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
