import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetAvailableSlots = vi.fn();

vi.mock("@calcom/features/di/containers/AvailableSlots", () => ({
  getAvailableSlotsService: () => ({
    getAvailableSlots: mockGetAvailableSlots,
  }),
}));

const mockGetBusyIntervals = vi.fn();
const mockResolveDuration = vi.fn();
const mockLoadSchedule = vi.fn();
const mockApplyConstraints = vi.fn();

vi.mock("@calcom/lib/dental/resource-availability", () => ({
  getTreatmentResourceBusyIntervals: (...args: unknown[]) => mockGetBusyIntervals(...args),
  resolveEventTypeDurationMinutes: (...args: unknown[]) => mockResolveDuration(...args),
}));

vi.mock("@calcom/lib/dental/resource-schedule", () => ({
  loadTreatmentResourceSchedule: (...args: unknown[]) => mockLoadSchedule(...args),
  applyTreatmentResourceConstraints: (...args: unknown[]) => mockApplyConstraints(...args),
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
    mockLoadSchedule.mockResolvedValue(null);
    mockApplyConstraints.mockImplementation((_schedule, params) => ({
      slots: params.busyIntervals.length ? {} : baseSchedule.slots,
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
    expect(mockApplyConstraints).not.toHaveBeenCalled();
  });

  it("applies resource schedule and busy constraints when resource is selected", async () => {
    const constrained = { slots: {} };
    mockApplyConstraints.mockReturnValue(constrained);

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

    expect(mockLoadSchedule).toHaveBeenCalledWith("resource-1");
    expect(mockApplyConstraints).toHaveBeenCalledWith(
      baseSchedule,
      expect.objectContaining({
        eventDurationMinutes: 45,
        resourceSchedule: null,
        busyIntervals: [],
      })
    );
    expect(result).toEqual(constrained);
  });
});
