import { parseBooleanEnv } from "../env";
import { isDentalClientComplianceMode } from "../compliance-config";
import { isDentalEncryptionEnabled } from "../feature-flags";

/**
 * Recall automation is enabled when explicitly turned on or in dental compliance deployments.
 */
export function isRecallEnabled(): boolean {
  if (parseBooleanEnv(process.env.RECALL_ENABLED)) {
    return true;
  }
  return isDentalEncryptionEnabled() || isDentalClientComplianceMode();
}
