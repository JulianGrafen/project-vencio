import * as Sentry from "@sentry/nextjs";
import { type Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { bootstrapRuntimeEnv } = await import("./lib/bootstrap-runtime-env");
    bootstrapRuntimeEnv();

    try {
      const { isPrismaAvailableCheck } = await import("@calcom/prisma/is-prisma-available-check");
      if (await isPrismaAvailableCheck()) {
        const { syncCalendarAppsFromEnv } = await import("@calcom/app-store/_utils/syncAppStoreFromEnv");
        await syncCalendarAppsFromEnv();
      }
    } catch (error) {
      console.warn("Calendar app store sync skipped:", error);
    }

    const { assertDentalProductionConfig } = await import("@calcom/lib/dental/production-config");
    try {
      assertDentalProductionConfig();
    } catch (error) {
      const { isDeploymentReady } = await import("@calcom/lib/deployment/readiness");
      if (isDeploymentReady()) {
        throw error;
      }
      console.error(
        "Dental production config is invalid, but core deployment env is also incomplete — skipping fail-fast until DATABASE_URL is set.",
        error
      );
    }
  }

  if (process.env.NODE_ENV === "production") {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NEXT_RUNTIME === "nodejs") {
      await import("./sentry.server.config");
    }
    if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NEXT_RUNTIME === "edge") {
      await import("./sentry.edge.config");
    }
  }
}

export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  if (process.env.NODE_ENV === "production") {
    Sentry.captureRequestError(err, request, context);
  }
};
