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
  API_KEY: "PVS_CONNECTOR_API_KEY",
} as const;
