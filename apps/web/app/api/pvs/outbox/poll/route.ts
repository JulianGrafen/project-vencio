import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";

import { handlePvsConnectorPost } from "@calcom/lib/dental/pvs/pvs-connector-api-handler";
import { ZPvsOutboxPollBody } from "@calcom/lib/dental/pvs/outbox-api.schemas";
import { PvsOutboxService } from "@calcom/lib/dental/pvs/pvs-outbox.service";
import { prisma } from "@calcom/prisma";

async function postHandler(request: NextRequest) {
  return handlePvsConnectorPost(prisma, request, ZPvsOutboxPollBody, async (body) => {
    const service = new PvsOutboxService(prisma);
    return service.pollPending(body.teamId, body.limit);
  });
}

export const POST = defaultResponderForAppDir(postHandler);
