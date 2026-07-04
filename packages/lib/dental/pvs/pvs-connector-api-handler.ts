import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { z } from "zod";

import type { PrismaClient } from "@calcom/prisma";

import { PvsConnectorAuthError, assertPvsConnectorAuthorizedForTeam } from "./pvs-connector-auth";
import { PvsOutboxNotFoundError } from "./pvs-outbox.service";

type TeamScopedBody = {
  teamId: number;
};

export async function handlePvsConnectorPost<T extends TeamScopedBody>(
  prisma: PrismaClient,
  request: NextRequest,
  schema: z.ZodType<T>,
  handler: (body: T) => Promise<unknown>
): Promise<Response> {
  const body = schema.parse(await request.json());

  try {
    await assertPvsConnectorAuthorizedForTeam(prisma, request.headers.get("authorization"), body.teamId);
  } catch (error) {
    if (error instanceof PvsConnectorAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    throw error;
  }

  try {
    const result = await handler(body);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof PvsOutboxNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    throw error;
  }
}
