import { describe, expect, it } from "vitest";

import { ZPvsOutboxAckBody, ZPvsOutboxPollBody } from "./outbox-api.schemas";

describe("outbox-api.schemas", () => {
  it("accepts valid poll body", () => {
    expect(ZPvsOutboxPollBody.parse({ teamId: 1, limit: 5 })).toEqual({ teamId: 1, limit: 5 });
  });

  it("requires externalId for completed ack", () => {
    const result = ZPvsOutboxAckBody.safeParse({
      teamId: 1,
      outboxId: "job-1",
      status: "COMPLETED",
    });

    expect(result.success).toBe(false);
  });

  it("requires error for failed ack", () => {
    const result = ZPvsOutboxAckBody.safeParse({
      teamId: 1,
      outboxId: "job-1",
      status: "FAILED",
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid completed ack", () => {
    expect(
      ZPvsOutboxAckBody.parse({
        teamId: 1,
        outboxId: "job-1",
        status: "COMPLETED",
        externalId: "PVS-99",
      })
    ).toMatchObject({ externalId: "PVS-99" });
  });
});
