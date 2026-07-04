import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  PvsConnectorAuthError,
  assertPvsConnectorAuthorizedForTeam,
} from "@calcom/lib/dental/pvs/pvs-connector-auth";
import { PvsOutboxService } from "@calcom/lib/dental/pvs/pvs-outbox.service";
import { prisma } from "@calcom/prisma";

const ZPollBody = z.object({
  teamId: z.number().int().positive(),
  limit: z.number().int().min(1).max(50).optional(),
});

async function postHandler(request: NextRequest) {
  const body = ZPollBody.parse(await request.json());

  try {
    await assertPvsConnectorAuthorizedForTeam(prisma, request.headers.get("authorization"), body.teamId);
  } catch (error) {
    if (error instanceof PvsConnectorAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    throw error;
  }

  const service = new PvsOutboxService(prisma);
  const result = await service.pollPending(body.teamId, body.limit);

  return NextResponse.json(result);
}

export const POST = defaultResponderForAppDir(postHandler);
