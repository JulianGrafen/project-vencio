import { describe, expect, it, afterEach } from "vitest";

import { assertCronAuthorized } from "./cron-auth";

function mockRequest(authHeader: string | null, queryKey: string | null, nodeEnv: string) {
  process.env.NODE_ENV = nodeEnv;
  process.env.CRON_SECRET = "cron-secret";

  return {
    headers: {
      get: (name: string) => (name === "authorization" ? authHeader : null),
    },
    nextUrl: {
      searchParams: {
        get: (name: string) => (name === "apiKey" ? queryKey : null),
      },
    },
  } as unknown as import("next/server").NextRequest;
}

describe("assertCronAuthorized", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalSecret = process.env.CRON_SECRET;
  const originalApiKey = process.env.CRON_API_KEY;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    if (originalSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = originalSecret;
    if (originalApiKey === undefined) delete process.env.CRON_API_KEY;
    else process.env.CRON_API_KEY = originalApiKey;
  });

  it("accepts bearer header auth", () => {
    expect(assertCronAuthorized(mockRequest("Bearer cron-secret", null, "production"))).toBe(true);
  });

  it("rejects query apiKey in production", () => {
    process.env.CRON_API_KEY = "query-key";
    expect(assertCronAuthorized(mockRequest(null, "query-key", "production"))).toBe(false);
  });

  it("allows query apiKey outside production", () => {
    process.env.CRON_API_KEY = "query-key";
    expect(assertCronAuthorized(mockRequest(null, "query-key", "development"))).toBe(true);
  });
});
