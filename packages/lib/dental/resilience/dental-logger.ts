import logger from "@calcom/lib/logger";

export type DentalLogContext = {
  module: string;
  teamId?: number;
  patientId?: string;
  jobId?: string;
  bookingUid?: string;
  requestId?: string;
  [key: string]: unknown;
};

export function createDentalLogger(context: DentalLogContext) {
  const log = logger.getSubLogger({ prefix: [`dental:${context.module}`] });

  return {
    info(message: string, extra?: Record<string, unknown>) {
      log.info(message, { ...context, ...extra });
    },
    warn(message: string, extra?: Record<string, unknown>) {
      log.warn(message, { ...context, ...extra });
    },
    error(message: string, error: unknown, extra?: Record<string, unknown>) {
      log.error(message, {
        ...context,
        ...extra,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    },
  };
}
