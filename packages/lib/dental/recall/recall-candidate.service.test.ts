import dayjs from "@calcom/dayjs";
import { describe, expect, it, vi } from "vitest";

import { BookingStatus } from "@calcom/prisma/enums";

import { RecallCandidateService } from "./recall-candidate.service";

describe("RecallCandidateService", () => {
  it("returns patients due exactly on interval date", async () => {
    const lastVisit = dayjs("2026-01-04").toDate();

    const prisma = {
      smartFillPatient: {
        findMany: vi.fn(async () => [
          {
            id: "pat-1",
            teamId: 1,
            name: "Anna",
            email: "anna@test.de",
            phoneNumber: "+491701",
            lastVisitAt: lastVisit,
          },
        ]),
      },
      booking: {
        findFirst: vi.fn(async () => null),
      },
    };

    const service = new RecallCandidateService(prisma as never);
    const result = await service.findDueCandidates({
      teamId: 1,
      intervalMonths: 6,
      toleranceDays: 3,
      referenceDate: dayjs("2026-07-04").toDate(),
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].patientId).toBe("pat-1");
    }
  });

  it("excludes patients with upcoming bookings", async () => {
    const prisma = {
      smartFillPatient: {
        findMany: vi.fn(async () => [
          {
            id: "pat-2",
            teamId: 1,
            name: "Ben",
            email: "ben@test.de",
            phoneNumber: "+491702",
            lastVisitAt: dayjs("2026-01-04").toDate(),
          },
        ]),
      },
      booking: {
        findFirst: vi.fn(async () => ({ id: 99 })),
      },
    };

    const service = new RecallCandidateService(prisma as never);
    const result = await service.findDueCandidates({
      teamId: 1,
      intervalMonths: 6,
      toleranceDays: 3,
      referenceDate: dayjs("2026-07-04").toDate(),
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(0);
    }
    expect(prisma.booking.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: expect.objectContaining({
            in: expect.arrayContaining([BookingStatus.ACCEPTED]),
          }),
        }),
      })
    );
  });

  it("skips patients outside tolerance window", async () => {
    const prisma = {
      smartFillPatient: {
        findMany: vi.fn(async () => [
          {
            id: "pat-3",
            teamId: 1,
            name: "Clara",
            email: "clara@test.de",
            phoneNumber: "+491703",
            lastVisitAt: dayjs("2025-06-01").toDate(),
          },
        ]),
      },
      booking: { findFirst: vi.fn(async () => null) },
    };

    const service = new RecallCandidateService(prisma as never);
    const result = await service.findDueCandidates({
      teamId: 1,
      intervalMonths: 6,
      toleranceDays: 3,
      referenceDate: dayjs("2026-07-04").toDate(),
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(0);
    }
  });

  it("returns error for invalid query params", async () => {
    const service = new RecallCandidateService({} as never);
    const result = await service.findDueCandidates({
      teamId: -1,
      intervalMonths: 6,
      toleranceDays: 3,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
    }
  });
});
