/** Max delivery attempts before an outbox row is marked permanently FAILED. */
export const PVS_OUTBOX_MAX_ATTEMPTS = 5;

/** Base delay for exponential backoff (5 minutes). */
export const PVS_OUTBOX_RETRY_BASE_MS = 5 * 60 * 1000;

export const PVS_CONNECTOR_ENV = {
  API_KEY: "PVS_CONNECTOR_API_KEY",
} as const;
