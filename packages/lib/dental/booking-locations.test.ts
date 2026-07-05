import { describe, expect, it } from "vitest";

import { DefaultEventLocationTypeEnum } from "@calcom/app-store/locations";

import { applyDentalLocationPolicyToEventLocations } from "./booking-location-policy";
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

    const filtered = filterDentalBookingLocations(
      [
        { type: DefaultEventLocationTypeEnum.InPerson, address: "Praxis" },
        { type: "integrations:google:meet" },
      ],
      "Praxis"
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.type).toBe(DefaultEventLocationTypeEnum.InPerson);
    expect(filtered[0]?.address).toBe("Praxis");
    expect(isDentalPracticeLocationType(filtered[0]!.type)).toBe(true);

    delete process.env.DENTAL_ENCRYPTION_ENABLED;
  });
});
