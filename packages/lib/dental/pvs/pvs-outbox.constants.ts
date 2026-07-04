import { parseBooleanEnv } from "../env";

/** Max delivery attempts before an outbox row is marked permanently FAILED. */
export const PVS_OUTBOX_MAX_ATTEMPTS = 5;

/** Base delay for exponential backoff (5 minutes). */
export const PVS_OUTBOX_RETRY_BASE_MS = 5 * 60 * 1000;

/** Default number of jobs returned per poll request. */
export const PVS_OUTBOX_POLL_DEFAULT_LIMIT = 10;

/** Maximum jobs per poll request (matches API schema). */
export const PVS_OUTBOX_POLL_MAX_LIMIT = 50;

/** Truncation limit for persisted connector error messages. */
export const PVS_OUTBOX_ERROR_MAX_LENGTH = 2000;

export const PVS_CONNECTOR_ENV = {
  /** Env var holding the legacy global connector bearer token. */
  CONNECTOR_BEARER_ENV: "PVS_CONNECTOR_API_KEY",
  /** Dev-only escape hatch; must not be set in production. */
  ALLOW_GLOBAL_KEY: "PVS_CONNECTOR_ALLOW_GLOBAL_KEY",
} as const;

/** Global connector key bypasses per-team credentials — disabled in production by default. */
export function isGlobalPvsConnectorKeyAllowed(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  return parseBooleanEnv(process.env[PVS_CONNECTOR_ENV.ALLOW_GLOBAL_KEY]);
}
