import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  resolveTeamIdFromBookingUid,
  resolveTeamIdFromEventTypeId,
  resolveTeamIdFromEventTypeRecord,
  resolveTeamIdFromInput,
} from "./practice-team-resolver";

const mockPrisma = {
  eventType: {
    findUnique: vi.fn(),
  },
  booking: {
    findUnique: vi.fn(),
  },
};

describe("practice-team-resolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns direct teamId from event type", async () => {
    mockPrisma.eventType.findUnique.mockResolvedValue({ teamId: 10, parentId: null });

    await expect(resolveTeamIdFromEventTypeId(mockPrisma as never, 1)).resolves.toBe(10);
  });

  it("resolves managed event types via parentId", async () => {
    mockPrisma.eventType.findUnique
      .mockResolvedValueOnce({ teamId: null, parentId: 99 })
      .mockResolvedValueOnce({ teamId: 42, parentId: null });

    await expect(resolveTeamIdFromEventTypeId(mockPrisma as never, 1)).resolves.toBe(42);
  });

  it("resolves teamId from nested team on event type record", async () => {
    await expect(
      resolveTeamIdFromEventTypeRecord(mockPrisma as never, {
        team: { id: 7 },
        parentId: null,
      })
    ).resolves.toBe(7);
  });

  it("resolves teamId from booking uid", async () => {
    mockPrisma.booking.findUnique = vi.fn(async () => ({
      eventType: { teamId: 55, parentId: null },
    }));

    await expect(resolveTeamIdFromBookingUid(mockPrisma as never, "booking-uid")).resolves.toBe(55);
  });

  it("resolves teamId from bookingUid input alias", async () => {
    mockPrisma.booking.findUnique = vi.fn(async () => ({
      eventType: { teamId: 88, parentId: null },
    }));

    await expect(
      resolveTeamIdFromInput(mockPrisma as never, { bookingUid: "uid-alias" })
    ).resolves.toBe(88);
  });
});
