import { DENTAL_ENV, parseBooleanEnv } from "./env";
import { DENTAL_PRODUCT_NAME } from "./brand";
import { isDentalEncryptionEnabled } from "./feature-flags";

// ---------------------------------------------------------------------------
// Server-side compliance (Node.js / API routes / tRPC)
// ---------------------------------------------------------------------------

/**
 * Central compliance switch for the dental fork.
 * Activated when DENTAL_ENCRYPTION_ENABLED=true (primary gate).
 */
export function isDentalComplianceMode(): boolean {
  return isDentalEncryptionEnabled();
}

/** UTM / marketing tracking must not store patient booking attribution in dental mode. */
export function isDentalTrackingDisabled(): boolean {
  return isDentalComplianceMode() || parseBooleanEnv(process.env[DENTAL_ENV.DISABLE_TRACKING]);
}

/**
 * BookingDenormalized duplicates PII in plaintext — incompatible with field encryption.
 * Triggers are removed via migration when dental mode is the deployment target.
 */
export function isDentalDenormalizedDisabled(): boolean {
  return isDentalComplianceMode() || parseBooleanEnv(process.env[DENTAL_ENV.DISABLE_DENORMALIZED]);
}

/** Third-party analytics (PostHog, Dub, GA) must not receive patient-related events. */
export function isDentalThirdPartyAnalyticsDisabled(): boolean {
  return (
    isDentalComplianceMode() || parseBooleanEnv(process.env[DENTAL_ENV.DISABLE_THIRD_PARTY_ANALYTICS])
  );
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

// ---------------------------------------------------------------------------
// Client-side compliance (NEXT_PUBLIC_* only — safe for browser bundles)
// ---------------------------------------------------------------------------

export function isDentalClientComplianceMode(): boolean {
  return (
    parseBooleanEnv(process.env[DENTAL_ENV.NEXT_PUBLIC_COMPLIANCE_MODE]) ||
    parseBooleanEnv(process.env[DENTAL_ENV.NEXT_PUBLIC_ENCRYPTION_ENABLED])
  );
}

/**
 * teeth.al signup: practice address, Behandlungsarten, in-practice locations.
 * Enabled in client compliance mode or when the app is branded as teeth.al (default fork).
 */
export function isDentalPracticeOnboardingEnabled(): boolean {
  if (isDentalClientComplianceMode()) {
    return true;
  }

  const appName = process.env.NEXT_PUBLIC_APP_NAME?.trim() || DENTAL_PRODUCT_NAME;
  return appName === DENTAL_PRODUCT_NAME;
}

export function isDentalClientTrackingDisabled(): boolean {
  return (
    isDentalClientComplianceMode() ||
    parseBooleanEnv(process.env[DENTAL_ENV.NEXT_PUBLIC_DISABLE_TRACKING])
  );
}

export function isDentalClientAnalyticsDisabled(): boolean {
  return (
    isDentalClientComplianceMode() ||
    parseBooleanEnv(process.env[DENTAL_ENV.NEXT_PUBLIC_DISABLE_THIRD_PARTY_ANALYTICS])
  );
}

/** Hide Cal.com App Store / Installed Apps navigation for dental practices. */
export function shouldHideAppStoreNavigation(): boolean {
  return isDentalComplianceMode() || isDentalClientComplianceMode();
}
