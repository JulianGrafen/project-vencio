import { DENTAL_ENV, parseBooleanEnv } from "./env";

/**
 * Server-side encryption gate — use for crypto read/write paths only.
 * For product/compliance behavior prefer {@link isDentalComplianceMode}.
 */
export function isDentalEncryptionEnabled(): boolean {
  return parseBooleanEnv(process.env[DENTAL_ENV.ENCRYPTION_ENABLED]);
}
