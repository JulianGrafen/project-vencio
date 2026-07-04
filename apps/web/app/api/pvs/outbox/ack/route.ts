import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";

import { handlePvsConnectorPost } from "@calcom/lib/dental/pvs/pvs-connector-api-handler";
import { ZPvsOutboxAckBody } from "@calcom/lib/dental/pvs/outbox-api.schemas";
import { PvsOutboxService } from "@calcom/lib/dental/pvs/pvs-outbox.service";
import { prisma } from "@calcom/prisma";

async function postHandler(request: NextRequest) {
  return handlePvsConnectorPost(prisma, request, ZPvsOutboxAckBody, async (body) => {
    const service = new PvsOutboxService(prisma);

    if (body.status === "COMPLETED") {
      return service.acknowledgeCompleted(body.teamId, body.outboxId, body.externalId!);
    }

    return service.acknowledgeFailed(body.teamId, body.outboxId, body.error!);
  });
}

export const POST = defaultResponderForAppDir(postHandler);
