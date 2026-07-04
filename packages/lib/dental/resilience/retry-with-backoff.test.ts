import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { retryWithBackoff } from "./retry-with-backoff";

describe("retryWithBackoff", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns result on first successful attempt", async () => {
    const operation = vi.fn(async () => "ok");
    const promise = retryWithBackoff(operation, { maxAttempts: 3, baseDelayMs: 100 });
    await expect(promise).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it("retries until success then returns data", async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new Error("transient"))
      .mockRejectedValueOnce(new Error("transient"))
      .mockResolvedValueOnce("recovered");

    const promise = retryWithBackoff(operation, { maxAttempts: 3, baseDelayMs: 100 });

    await vi.runAllTimersAsync();
    await expect(promise).resolves.toBe("recovered");
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it("throws last error after exhausting attempts", async () => {
    const operation = vi.fn(async () => {
      throw new Error("DB timeout");
    });

    const promise = retryWithBackoff(operation, { maxAttempts: 2, baseDelayMs: 50 });
    const expectation = expect(promise).rejects.toThrow("DB timeout");

    await vi.runAllTimersAsync();
    await expectation;
    expect(operation).toHaveBeenCalledTimes(2);
  });
});
