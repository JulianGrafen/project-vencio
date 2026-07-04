#!/usr/bin/env node
import process from "node:process";

import { DampsoftPvsAdapter } from "@calcom/pvs-integration";

import { PvsConnectorClient, runPvsConnectorOnce } from "./runner";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

async function main() {
  const baseUrl = requireEnv("PVS_CLOUD_BASE_URL");
  const apiKey = requireEnv("PVS_CONNECTOR_API_KEY");
  const teamId = Number(requireEnv("PVS_TEAM_ID"));
  const intervalMs = Number(process.env.PVS_POLL_INTERVAL_MS ?? "30000");

  if (!teamId || Number.isNaN(teamId)) {
    throw new Error("PVS_TEAM_ID must be a positive integer");
  }

  const client = new PvsConnectorClient({ baseUrl, apiKey, teamId });
  const adapter = new DampsoftPvsAdapter();

  console.info(`PVS connector started — team=${teamId}, poll every ${intervalMs}ms`);

  const tick = async () => {
    try {
      const processed = await runPvsConnectorOnce({
        client,
        adapter,
        onJobProcessed: (jobId, status) => {
          console.info(`Job ${jobId} → ${status}`);
        },
      });
      if (processed > 0) {
        console.info(`Processed ${processed} job(s)`);
      }
    } catch (error) {
      console.error("Poll cycle failed:", error instanceof Error ? error.message : error);
    }
  };

  await tick();
  setInterval(tick, intervalMs);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
