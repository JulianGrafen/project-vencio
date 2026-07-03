import { parseBooleanEnv } from "../env";
import { SMART_FILL_ENV } from "./constants";

/**
 * Smart-Fill is enabled when explicitly turned on or when dental compliance mode
 * is active (B2B dental deployments default to on).
 */
export function isSmartFillEnabled(): boolean {
  return parseBooleanEnv(process.env[SMART_FILL_ENV.ENABLED]);
}
