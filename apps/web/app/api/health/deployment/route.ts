import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import { NextResponse } from "next/server";

import { validateDeploymentReadiness } from "@calcom/lib/deployment/readiness";

async function getHandler() {
  const readiness = validateDeploymentReadiness();

  return NextResponse.json(
    {
      ready: readiness.ready,
      checks: readiness.checks,
    },
    { status: readiness.ready ? 200 : 503 }
  );
}

export const GET = defaultResponderForAppDir(getHandler);
