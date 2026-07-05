import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import { NextResponse } from "next/server";

import { validateCalendarOAuthReadiness } from "@calcom/lib/deployment/calendar-readiness";

async function getHandler() {
  const readiness = validateCalendarOAuthReadiness();

  return NextResponse.json(
    {
      ready: readiness.ready,
      webappUrl: process.env.NEXT_PUBLIC_WEBAPP_URL ?? null,
      checks: readiness.checks,
    },
    { status: readiness.ready ? 200 : 503 }
  );
}

export const GET = defaultResponderForAppDir(getHandler);
