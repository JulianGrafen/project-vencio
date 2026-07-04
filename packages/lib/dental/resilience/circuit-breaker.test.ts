import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { CircuitBreaker, resetCircuitBreakersForTests } from "./circuit-breaker";

describe("CircuitBreaker", () => {
  beforeEach(() => {
    resetCircuitBreakersForTests();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("passes through successful operations", async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 60_000 });
    const result = await breaker.execute(async () => okValue());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("ok");
    }
  });

  it("opens after consecutive failures", async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 60_000 });

    for (let i = 0; i < 3; i += 1) {
      const result = await breaker.execute(async () => {
        throw new Error("PVS down");
      });
      expect(result.success).toBe(false);
    }

    expect(breaker.getState()).toBe("open");

    const blocked = await breaker.execute(async () => "should not run");
    expect(blocked.success).toBe(false);
    if (!blocked.success) {
      expect(blocked.error).toBe("circuit_open");
    }
  });

  it("transitions to half-open after cooldown", async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 5_000 });

    await breaker.execute(async () => {
      throw new Error("fail");
    });
    expect(breaker.getState()).toBe("open");

    vi.advanceTimersByTime(5_000);
    expect(breaker.getState()).toBe("half_open");

    const recovered = await breaker.execute(async () => "recovered");
    expect(recovered.success).toBe(true);
    expect(breaker.getState()).toBe("closed");
  });
});

async function okValue(): Promise<string> {
  return "ok";
}
