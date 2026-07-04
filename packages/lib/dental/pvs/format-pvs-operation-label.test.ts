import { describe, expect, it } from "vitest";

import { formatPvsOperationLabel } from "./format-pvs-operation-label";

describe("formatPvsOperationLabel", () => {
  it("maps known operations to short labels", () => {
    expect(formatPvsOperationLabel("CREATE_APPOINTMENT")).toBe("CREATE");
    expect(formatPvsOperationLabel("CANCEL_APPOINTMENT")).toBe("CANCEL");
  });
});
