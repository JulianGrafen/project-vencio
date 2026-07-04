import { parseBooleanEnv } from "../env";
import { isDentalEncryptionEnabled } from "../feature-flags";
import { RECALL_ENV } from "./constants";

/**
 * Recall automation is enabled when explicitly turned on or in dental compliance deployments.
 */
export function isRecallEnabled(): boolean {
  if (parseBooleanEnv(process.env[RECALL_ENV.ENABLED])) {
    return true;
  }
  return isDentalEncryptionEnabled();
}
