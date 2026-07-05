import { parseBooleanEnv } from "../env";
import { isDentalClientComplianceMode } from "../compliance-config";
import { isDentalEncryptionEnabled } from "../feature-flags";

/**
 * Smart-Fill is enabled when explicitly turned on or when dental compliance mode
 * is active (B2B dental deployments default to on).
 */
export function isSmartFillEnabled(): boolean {
  if (parseBooleanEnv(process.env.SMART_FILL_ENABLED)) {
    return true;
  }
  return isDentalEncryptionEnabled() || isDentalClientComplianceMode();
}
