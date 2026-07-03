import { isDentalEncryptionEnabled } from "../encryption/tenant-context";

/**
 * Central compliance switches for the dental fork.
 * Activated when DENTAL_ENCRYPTION_ENABLED=true (primary gate).
 */
export function isDentalComplianceMode(): boolean {
  return isDentalEncryptionEnabled();
}

/** UTM / marketing tracking must not store patient booking attribution in dental mode. */
export function isDentalTrackingDisabled(): boolean {
  return isDentalComplianceMode() || process.env.DENTAL_DISABLE_TRACKING === "true";
}

/**
 * BookingDenormalized duplicates PII in plaintext — incompatible with field encryption.
 * Triggers are removed via migration when dental mode is the deployment target.
 */
export function isDentalDenormalizedDisabled(): boolean {
  return isDentalComplianceMode() || process.env.DENTAL_DISABLE_DENORMALIZED === "true";
}

/** Third-party analytics (PostHog, Dub, GA) must not receive patient-related events. */
export function isDentalThirdPartyAnalyticsDisabled(): boolean {
  return isDentalComplianceMode() || process.env.DENTAL_DISABLE_THIRD_PARTY_ANALYTICS === "true";
}

/** Strip tracking payload before persisting a booking. */
export function sanitizeBookingTracking<T extends Record<string, unknown> | undefined>(
  tracking: T
): T | undefined {
  if (!tracking || !isDentalTrackingDisabled()) {
    return tracking;
  }
  return undefined;
}
