import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  PvsConnectorAuthError,
  assertPvsConnectorAuthorizedForTeam,
} from "@calcom/lib/dental/pvs/pvs-connector-auth";
import {
  PvsOutboxNotFoundError,
  PvsOutboxService,
} from "@calcom/lib/dental/pvs/pvs-outbox.service";
import { prisma } from "@calcom/prisma";

const ZAckBody = z
  .object({
    teamId: z.number().int().positive(),
    outboxId: z.string().min(1),
    status: z.enum(["COMPLETED", "FAILED"]),
    externalId: z.string().min(1).optional(),
    error: z.string().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.status === "COMPLETED" && !value.externalId) {
      ctx.addIssue({
        code: "custom",
        message: "externalId is required when status is COMPLETED",
        path: ["externalId"],
      });
    }
    if (value.status === "FAILED" && !value.error) {
      ctx.addIssue({
        code: "custom",
        message: "error is required when status is FAILED",
        path: ["error"],
      });
    }
  });

async function postHandler(request: NextRequest) {
  const body = ZAckBody.parse(await request.json());

  try {
    await assertPvsConnectorAuthorizedForTeam(prisma, request.headers.get("authorization"), body.teamId);
  } catch (error) {
    if (error instanceof PvsConnectorAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    throw error;
  }

  const service = new PvsOutboxService(prisma);

  try {
    const result =
      body.status === "COMPLETED"
        ? await service.acknowledgeCompleted(body.teamId, body.outboxId, body.externalId!)
        : await service.acknowledgeFailed(body.teamId, body.outboxId, body.error!);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof PvsOutboxNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    throw error;
  }
}

export const POST = defaultResponderForAppDir(postHandler);
