import { beforeEach, describe, expect, it, vi } from "vitest";

import { tenantContextStorage } from "../encryption/tenant-context";

vi.mock("@calcom/prisma", () => ({
  prisma: {},
}));

const mockResolveTeamId = vi.fn();
vi.mock("./practice-team-resolver", () => ({
  resolveTeamIdFromEventTypeId: (...args: unknown[]) => mockResolveTeamId(...args),
}));

import {
  runWithDentalPracticeContext,
  runWithDentalPracticeContextForEventType,
} from "./run-with-dental-context";

describe("run-with-dental-context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResolveTeamId.mockResolvedValue(42);
  });

  it("runWithDentalPracticeContext skips tenant context when teamId is missing", async () => {
    const storeDuringHandler = await runWithDentalPracticeContext(
      { teamId: null, operation: "encrypt" },
      async () => tenantContextStorage.getStore()
    );

    expect(storeDuringHandler).toBeUndefined();
  });

  it("runWithDentalPracticeContext sets tenant context when teamId is present", async () => {
    const storeDuringHandler = await runWithDentalPracticeContext(
      { teamId: 42, operation: "decrypt", actorUserId: 7 },
      async () => tenantContextStorage.getStore()
    );

    expect(storeDuringHandler).toEqual({
      teamId: 42,
      operation: "decrypt",
      actorUserId: 7,
    });
  });

  it("runWithDentalPracticeContextForEventType resolves teamId from event type", async () => {
    let resolvedTeamId: number | undefined;

    await runWithDentalPracticeContextForEventType(
      { eventTypeId: 5, operation: "encrypt" },
      async () => {
        resolvedTeamId = tenantContextStorage.getStore()?.teamId;
      }
    );

    expect(mockResolveTeamId).toHaveBeenCalledWith({}, 5);
    expect(resolvedTeamId).toBe(42);
  });
});
