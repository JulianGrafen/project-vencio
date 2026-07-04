import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { assertCronAuthorized } from "@calcom/lib/dental/cron-auth";
import { createDentalLogger } from "@calcom/lib/dental/resilience/dental-logger";
import { SmartFillCronService } from "@calcom/lib/dental/smart-fill";
import { isSmartFillEnabled } from "@calcom/lib/dental/smart-fill/feature-flags";
import { prisma } from "@calcom/prisma";

const log = createDentalLogger({ module: "cron-smart-fill" });

/**
 * Vercel Cron — runs every 6 hours.
 * Scans calendars for Smart-Fill candidate slots and sends patient SMS invites.
 */
async function postHandler(request: NextRequest) {
  if (!assertCronAuthorized(request)) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (!isSmartFillEnabled()) {
    log.info("Smart-Fill cron skipped — feature disabled");
    return NextResponse.json({ message: "Smart-Fill disabled", skipped: true });
  }

  const service = new SmartFillCronService(prisma);
  const result = await service.run();

  if (result.errors.length > 0) {
    log.warn("Smart-Fill cron completed with errors", { errorCount: result.errors.length });
  }

  return NextResponse.json(result);
}

export const POST = defaultResponderForAppDir(postHandler);
