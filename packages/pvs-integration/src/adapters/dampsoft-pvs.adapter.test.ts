import { describe } from "vitest";

import { DampsoftPvsAdapter } from "./dampsoft-pvs.adapter";
import { runPvsAdapterContractTests } from "./pvs-adapter.contract";

describe("DampsoftPvsAdapter", () => {
  runPvsAdapterContractTests(() => new DampsoftPvsAdapter());
});
