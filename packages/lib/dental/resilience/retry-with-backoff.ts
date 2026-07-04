export type RetryOptions = {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  label?: string;
  /** Return true to retry this error (default: always retry until maxAttempts). */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
};

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_BASE_DELAY_MS = 500;
const DEFAULT_MAX_DELAY_MS = 30_000;

function computeDelayMs(baseDelayMs: number, attempt: number, maxDelayMs: number): number {
  const exponential = baseDelayMs * 2 ** Math.max(0, attempt - 1);
  return Math.min(exponential, maxDelayMs);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Retries an async operation with exponential backoff.
 * @throws The last error when all attempts are exhausted.
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  const maxDelayMs = options.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;
  const shouldRetry = options.shouldRetry ?? (() => true);

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt >= maxAttempts || !shouldRetry(error, attempt)) {
        break;
      }

      const delayMs = computeDelayMs(baseDelayMs, attempt, maxDelayMs);
      options.onRetry?.(error, attempt, delayMs);
      await sleep(delayMs);
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error(
    options.label
      ? `${options.label} failed after ${maxAttempts} attempt(s)`
      : `Operation failed after ${maxAttempts} attempt(s)`
  );
}

/**
 * Result-based variant — never throws; returns error string on failure.
 */
export async function retryWithBackoffResult<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await retryWithBackoff(operation, options);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
