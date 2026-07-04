import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import { NextResponse } from "next/server";

import { validateDentalProductionConfig } from "@calcom/lib/dental/production-config";
import { isPvsSyncEnabled } from "@calcom/lib/dental/pvs/feature-flags";
import { isRecallEnabled } from "@calcom/lib/dental/recall/feature-flags";
import { isSmartFillEnabled } from "@calcom/lib/dental/smart-fill/feature-flags";

/**
 * Production readiness probe for dental deployments.
 * Returns 200 when config is valid, 503 when production checks fail.
 */
async function getHandler() {
  const readiness = validateDentalProductionConfig();

  const body = {
    ready: readiness.ready,
    environment: readiness.environment,
    complianceMode: readiness.complianceMode,
    features: {
      smartFill: isSmartFillEnabled(),
      recall: isRecallEnabled(),
      pvsSync: isPvsSyncEnabled(),
    },
    checks: readiness.checks.map(({ id, ok, message }) => ({ id, ok, message })),
  };

  return NextResponse.json(body, { status: readiness.ready ? 200 : 503 });
}

export const GET = defaultResponderForAppDir(getHandler);
