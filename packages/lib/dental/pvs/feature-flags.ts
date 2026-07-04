import { parseBooleanEnv } from "../env";
import { isDentalEncryptionEnabled } from "../feature-flags";

export const PVS_SYNC_ENV = {
  ENABLED: "PVS_SYNC_ENABLED",
} as const;

/**
 * PVS outbox sync is on when explicitly enabled or in dental compliance deployments.
 */
export function isPvsSyncEnabled(): boolean {
  if (parseBooleanEnv(process.env[PVS_SYNC_ENV.ENABLED])) {
    return true;
  }
  return isDentalEncryptionEnabled();
}
