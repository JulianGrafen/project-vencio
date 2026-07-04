import { describe, expect, it, vi } from "vitest";

import { RecallPendingService } from "./recall-pending.service";

describe("RecallPendingService", () => {
  it("returns empty list when recall is disabled for the practice", async () => {
    const settingsService = {
      getOrCreateForTeam: vi.fn(async () => ({
        enabled: false,
        intervalMonths: 6,
        toleranceDays: 3,
      })),
    };
    const candidateService = {
      findPendingForWeek: vi.fn(),
    };

    const service = new RecallPendingService({} as never);
    Object.assign(service, { settingsService, candidateService });

    const items = await service.listPendingForTeam(1);

    expect(items).toEqual([]);
    expect(candidateService.findPendingForWeek).not.toHaveBeenCalled();
  });
});
