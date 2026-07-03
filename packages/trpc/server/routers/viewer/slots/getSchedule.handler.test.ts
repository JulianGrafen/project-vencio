import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetAvailableSlots = vi.fn();

vi.mock("@calcom/features/di/containers/AvailableSlots", () => ({
  getAvailableSlotsService: () => ({
    getAvailableSlots: mockGetAvailableSlots,
  }),
}));

const mockGetBusyIntervals = vi.fn();
const mockResolveDuration = vi.fn();
const mockFilterSlots = vi.fn();

vi.mock("@calcom/lib/dental/resource-availability", () => ({
  getTreatmentResourceBusyIntervals: (...args: unknown[]) => mockGetBusyIntervals(...args),
  resolveEventTypeDurationMinutes: (...args: unknown[]) => mockResolveDuration(...args),
  filterAvailableSlotsByResourceBusyTimes: (...args: unknown[]) => mockFilterSlots(...args),
}));

import { getScheduleHandler } from "./getSchedule.handler";

describe("getScheduleHandler", () => {
  const baseSchedule = {
    slots: {
      "2026-07-10": [{ time: "2026-07-10T09:00:00.000Z" }],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAvailableSlots.mockResolvedValue(baseSchedule);
    mockGetBusyIntervals.mockResolvedValue([]);
    mockResolveDuration.mockResolvedValue(30);
    mockFilterSlots.mockImplementation((_schedule, _busy, _duration) => ({
      slots: {},
    }));
  });

  it("returns schedule unchanged when no treatmentResourceId is set", async () => {
    const result = await getScheduleHandler({
      ctx: {} as never,
      input: {
        startTime: "2026-07-01T00:00:00.000Z",
        endTime: "2026-07-31T00:00:00.000Z",
        eventTypeId: 1,
      },
    });

    expect(result).toEqual(baseSchedule);
    expect(mockGetBusyIntervals).not.toHaveBeenCalled();
  });

  it("filters slots when treatmentResourceId and eventTypeId are provided", async () => {
    const filtered = { slots: { "2026-07-10": [] } };
    mockFilterSlots.mockReturnValue(filtered);

    const result = await getScheduleHandler({
      ctx: {} as never,
      input: {
        startTime: "2026-07-01T00:00:00.000Z",
        endTime: "2026-07-31T00:00:00.000Z",
        eventTypeId: 1,
        treatmentResourceId: "resource-1",
        duration: 45,
      },
    });

    expect(mockGetBusyIntervals).toHaveBeenCalledWith(
      "resource-1",
      new Date("2026-07-01T00:00:00.000Z"),
      new Date("2026-07-31T00:00:00.000Z")
    );
    expect(mockFilterSlots).toHaveBeenCalledWith(baseSchedule, [], 45);
    expect(result).toEqual(filtered);
  });

  it("resolves duration from event type when not provided in input", async () => {
    await getScheduleHandler({
      ctx: {} as never,
      input: {
        startTime: "2026-07-01T00:00:00.000Z",
        endTime: "2026-07-31T00:00:00.000Z",
        eventTypeId: 99,
        treatmentResourceId: "resource-1",
      },
    });

    expect(mockResolveDuration).toHaveBeenCalledWith(99);
    expect(mockFilterSlots).toHaveBeenCalledWith(baseSchedule, [], 30);
  });
});
