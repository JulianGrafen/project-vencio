import { beforeEach, describe, expect, it, vi } from "vitest";

const { getQueryParamMock, localStorageMock, isDentalClientComplianceModeMock } = vi.hoisted(() => ({
  getQueryParamMock: vi.fn(),
  localStorageMock: {
    getItem: vi.fn(),
  },
  isDentalClientComplianceModeMock: vi.fn(),
}));

vi.mock("@calcom/features/bookings/Booker/utils/query-param", () => ({
  getQueryParam: getQueryParamMock,
}));

vi.mock("@calcom/lib/webstorage", () => ({
  localStorage: localStorageMock,
}));

vi.mock("../compliance-config", () => ({
  isDentalClientComplianceMode: isDentalClientComplianceModeMock,
}));

import { isOverlayCalendarSlotSelectionEnabled } from "./overlay-calendar";

describe("isOverlayCalendarSlotSelectionEnabled", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isDentalClientComplianceModeMock.mockReturnValue(false);
    getQueryParamMock.mockReturnValue(null);
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("returns false in dental compliance mode even when overlay flags are set", () => {
    isDentalClientComplianceModeMock.mockReturnValue(true);
    getQueryParamMock.mockReturnValue("true");
    localStorageMock.getItem.mockReturnValue("true");

    expect(isOverlayCalendarSlotSelectionEnabled()).toBe(false);
  });

  it("returns true when overlay calendar query param is enabled", () => {
    getQueryParamMock.mockReturnValue("true");

    expect(isOverlayCalendarSlotSelectionEnabled()).toBe(true);
  });

  it("returns true when overlay calendar default is stored in localStorage", () => {
    localStorageMock.getItem.mockReturnValue("true");

    expect(isOverlayCalendarSlotSelectionEnabled()).toBe(true);
  });
});
