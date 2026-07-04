import type { Result } from "./result";
import { err, ok } from "./result";

export type CircuitBreakerOptions = {
  failureThreshold: number;
  resetTimeoutMs: number;
  name?: string;
};

type CircuitState = "closed" | "open" | "half_open";

/**
 * Simple in-memory circuit breaker for external adapters (PVS, SMS, email).
 * Opens after `failureThreshold` consecutive failures; half-opens after cooldown.
 */
export class CircuitBreaker {
  private state: CircuitState = "closed";
  private consecutiveFailures = 0;
  private openedAt: number | null = null;

  constructor(private readonly options: CircuitBreakerOptions) {}

  getState(): CircuitState {
    this.maybeTransitionToHalfOpen();
    return this.state;
  }

  async execute<T>(operation: () => Promise<T>): Promise<Result<T, "circuit_open" | string>> {
    this.maybeTransitionToHalfOpen();

    if (this.state === "open") {
      return err("circuit_open");
    }

    try {
      const data = await operation();
      this.onSuccess();
      return ok(data);
    } catch (error) {
      this.onFailure();
      return err(error instanceof Error ? error.message : String(error));
    }
  }

  private onSuccess(): void {
    this.consecutiveFailures = 0;
    this.state = "closed";
    this.openedAt = null;
  }

  private onFailure(): void {
    this.consecutiveFailures += 1;

    if (this.consecutiveFailures >= this.options.failureThreshold) {
      this.state = "open";
      this.openedAt = Date.now();
    }
  }

  private maybeTransitionToHalfOpen(): void {
    if (this.state !== "open" || this.openedAt === null) {
      return;
    }

    if (Date.now() - this.openedAt >= this.options.resetTimeoutMs) {
      this.state = "half_open";
    }
  }
}

/** Shared breaker instances keyed by provider name (one per process). */
const breakers = new Map<string, CircuitBreaker>();

export function getPvsAdapterCircuitBreaker(provider: string): CircuitBreaker {
  const key = `pvs:${provider}`;
  let breaker = breakers.get(key);

  if (!breaker) {
    breaker = new CircuitBreaker({
      name: key,
      failureThreshold: 3,
      resetTimeoutMs: 60_000,
    });
    breakers.set(key, breaker);
  }

  return breaker;
}

/** @internal Test helper */
export function resetCircuitBreakersForTests(): void {
  breakers.clear();
}
