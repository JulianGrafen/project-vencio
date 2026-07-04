import { describe } from "vitest";

import { MockPvsAdapter } from "./mock-pvs.adapter";
import { runPvsAdapterContractTests } from "./pvs-adapter.contract";

describe("MockPvsAdapter", () => {
  runPvsAdapterContractTests(() => new MockPvsAdapter());
});
