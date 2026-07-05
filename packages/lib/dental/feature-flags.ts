import { parseBooleanEnv } from "./env";

/**
 * Server-side encryption gate — use for crypto read/write paths only.
 * For product/compliance behavior prefer {@link isDentalComplianceMode}.
 */
export function isDentalEncryptionEnabled(): boolean {
  return parseBooleanEnv(process.env.DENTAL_ENCRYPTION_ENABLED);
}
