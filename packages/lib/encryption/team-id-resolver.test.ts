import { beforeEach, describe, expect, it, vi } from "vitest";

import { tenantContextStorage, runWithTenantContextAsync } from "./tenant-context";

vi.mock("@calcom/lib/dental/practice-team-resolver", () => ({
  resolveTeamIdFromEventTypeId: vi.fn(async () => 99),
  resolveTeamIdFromBookingId: vi.fn(async () => 88),
}));

import { resolveTeamIdFromWriteData } from "./team-id-resolver";

const mockPrisma = {} as never;

describe("team-id-resolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns teamId from tenant context when set", async () => {
    const teamId = await runWithTenantContextAsync({ teamId: 7, operation: "encrypt" }, () =>
      resolveTeamIdFromWriteData(mockPrisma, "Booking", { eventTypeId: 1 })
    );

    expect(teamId).toBe(7);
  });

  it("returns teamId directly from write data", async () => {
    const teamId = await resolveTeamIdFromWriteData(mockPrisma, "Booking", { teamId: 12 });
    expect(teamId).toBe(12);
  });

  it("resolves teamId from booking eventTypeId", async () => {
    const teamId = await resolveTeamIdFromWriteData(mockPrisma, "Booking", { eventTypeId: 3 });
    expect(teamId).toBe(99);
  });

  it("resolves teamId from attendee booking connect", async () => {
    const teamId = await resolveTeamIdFromWriteData(mockPrisma, "Attendee", {
      booking: { connect: { id: 55 } },
    });
    expect(teamId).toBe(88);
  });
});
