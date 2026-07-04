import type { NextRequest } from "next/server";

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Validates Vercel cron / scheduled job requests.
 * Query-string API keys are rejected in production (log/referrer leakage).
 */
export function assertCronAuthorized(request: NextRequest): boolean {
  const headerKey = request.headers.get("authorization");
  const queryKey = request.nextUrl.searchParams.get("apiKey");

  if (isProduction() && queryKey) {
    return false;
  }

  const apiKey = headerKey ?? queryKey;
  return (
    (process.env.CRON_API_KEY !== undefined && process.env.CRON_API_KEY === apiKey) ||
    (process.env.CRON_SECRET !== undefined && `Bearer ${process.env.CRON_SECRET}` === apiKey)
  );
}
