export type RetryOptions = {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
};

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_BASE_DELAY_MS = 500;
const DEFAULT_MAX_DELAY_MS = 30_000;

function computeDelayMs(baseDelayMs: number, attempt: number, maxDelayMs: number): number {
  return Math.min(baseDelayMs * 2 ** Math.max(0, attempt - 1), maxDelayMs);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  const maxDelayMs = options.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt >= maxAttempts) break;
      await sleep(computeDelayMs(baseDelayMs, attempt, maxDelayMs));
    }
  }

  if (lastError instanceof Error) throw lastError;
  throw new Error(`Operation failed after ${maxAttempts} attempt(s)`);
}

type CircuitState = "closed" | "open" | "half_open";

export class CircuitBreaker {
  private state: CircuitState = "closed";
  private consecutiveFailures = 0;
  private openedAt: number | null = null;

  constructor(
    private readonly failureThreshold: number,
    private readonly resetTimeoutMs: number
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    this.maybeTransitionToHalfOpen();

    if (this.state === "open") {
      throw new Error("circuit_open");
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.consecutiveFailures = 0;
    this.state = "closed";
    this.openedAt = null;
  }

  private onFailure(): void {
    this.consecutiveFailures += 1;
    if (this.consecutiveFailures >= this.failureThreshold) {
      this.state = "open";
      this.openedAt = Date.now();
    }
  }

  private maybeTransitionToHalfOpen(): void {
    if (this.state !== "open" || this.openedAt === null) return;
    if (Date.now() - this.openedAt >= this.resetTimeoutMs) {
      this.state = "half_open";
    }
  }
}

let pvsAdapterBreaker: CircuitBreaker | null = null;

export function getPvsAdapterCircuitBreaker(): CircuitBreaker {
  if (!pvsAdapterBreaker) {
    pvsAdapterBreaker = new CircuitBreaker(3, 60_000);
  }
  return pvsAdapterBreaker;
}

/** @internal */
export function resetPvsCircuitBreakerForTests(): void {
  pvsAdapterBreaker = null;
}
