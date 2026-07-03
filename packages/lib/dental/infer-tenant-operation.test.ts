import { describe, expect, it } from "vitest";

import { inferTenantOperationFromPath } from "./infer-tenant-operation";

describe("inferTenantOperationFromPath", () => {
  it("returns encrypt for write paths", () => {
    expect(inferTenantOperationFromPath("bookings.create")).toBe("encrypt");
    expect(inferTenantOperationFromPath("bookings.updateLocation")).toBe("encrypt");
    expect(inferTenantOperationFromPath("bookings.confirm")).toBe("encrypt");
  });

  it("returns decrypt for read paths", () => {
    expect(inferTenantOperationFromPath("bookings.get")).toBe("decrypt");
    expect(inferTenantOperationFromPath("bookings.list")).toBe("decrypt");
  });
});
