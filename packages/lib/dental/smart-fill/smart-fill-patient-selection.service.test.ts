import { describe, expect, it, vi } from "vitest";

import { SmartFillPatientSelectionService } from "./smart-fill-patient-selection.service";

describe("SmartFillPatientSelectionService", () => {
  it("prioritizes waitlist patients over recall-only patients", async () => {
    const prisma = {
      smartFillPatient: {
        findMany: vi.fn(async () => [
          {
            id: "p1",
            name: "Recall",
            email: "a@test.de",
            phoneNumber: "+491111",
            waitlistEnabled: false,
            lastVisitAt: new Date("2025-01-01"),
            priorityScore: 0,
          },
          {
            id: "p2",
            name: "Waitlist",
            email: "b@test.de",
            phoneNumber: "+492222",
            waitlistEnabled: true,
            lastVisitAt: new Date("2026-06-01"),
            priorityScore: 0,
          },
        ]),
      },
    };

    const service = new SmartFillPatientSelectionService(prisma as never);
    const result = await service.selectCandidates({ teamId: 1, limit: 2 });

    expect(result[0].id).toBe("p2");
    expect(result[0].waitlistEnabled).toBe(true);
  });
});
