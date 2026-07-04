import { describe, expect, it } from "vitest";

import { DefaultEventLocationTypeEnum } from "@calcom/app-store/locations";

import {
  filterDentalBookingLocations,
  isDentalPracticeLocationType,
  isVideoConferencingLocationType,
} from "./booking-locations";

describe("booking-locations", () => {
  it("detects video conferencing types", () => {
    expect(isVideoConferencingLocationType("integrations:zoom")).toBe(true);
    expect(isVideoConferencingLocationType(DefaultEventLocationTypeEnum.Conferencing)).toBe(true);
    expect(isVideoConferencingLocationType(DefaultEventLocationTypeEnum.InPerson)).toBe(false);
  });

  it("filters to in-practice locations in dental compliance mode", () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";

    const filtered = filterDentalBookingLocations([
      { type: DefaultEventLocationTypeEnum.InPerson, address: "Praxis" },
      { type: "integrations:google:meet" },
    ]);

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.type).toBe(DefaultEventLocationTypeEnum.InPerson);
    expect(isDentalPracticeLocationType(filtered[0]!.type)).toBe(true);

    delete process.env.DENTAL_ENCRYPTION_ENABLED;
  });
});
