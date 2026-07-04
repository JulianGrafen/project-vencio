import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { assertCronAuthorized } from "@calcom/lib/dental/cron-auth";
import { RecallCronService } from "@calcom/lib/dental/recall";
import { isRecallEnabled } from "@calcom/lib/dental/recall/feature-flags";
import { createDentalLogger } from "@calcom/lib/dental/resilience/dental-logger";
import { prisma } from "@calcom/prisma";

const log = createDentalLogger({ module: "cron-recall" });

/**
 * Vercel Cron — runs daily.
 * Sends prophylaxis recall emails/SMS for patients due after configured interval.
 */
async function postHandler(request: NextRequest) {
  if (!assertCronAuthorized(request)) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (!isRecallEnabled()) {
    log.info("Recall cron skipped — feature disabled");
    return NextResponse.json({ message: "Recall disabled", skipped: true });
  }

  const service = new RecallCronService(prisma);
  const result = await service.run();

  if (result.errors.length > 0) {
    log.warn("Recall cron completed with errors", { errorCount: result.errors.length });
  }

  return NextResponse.json(result);
}

export const POST = defaultResponderForAppDir(postHandler);
