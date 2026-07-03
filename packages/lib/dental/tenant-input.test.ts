import { describe, expect, it } from "vitest";

import { inferTenantOperationFromPath } from "./infer-tenant-operation";
import { resolveTeamIdsForAttendeeEmailFilter } from "./attendee-blind-index-filter";

describe("dental tenant input resolution helpers", () => {
  it("resolveTeamIdsForAttendeeEmailFilter uses single filter teamId for middleware-style lookup", () => {
    const teamIds = resolveTeamIdsForAttendeeEmailFilter([42], [99]);
    expect(teamIds).toEqual([42]);
  });

  it("inferTenantOperationFromPath maps booking mutations to encrypt", () => {
    expect(inferTenantOperationFromPath("bookings.confirm")).toBe("encrypt");
    expect(inferTenantOperationFromPath("bookings.get")).toBe("decrypt");
  });
});
