import { DefaultEventLocationTypeEnum } from "@calcom/app-store/locations";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  applyDentalLocationPolicyToEventLocations,
  buildDentalInPersonLocation,
  isDentalVideoBookingLocation,
  resolveDentalBookingLocation,
} from "./booking-location-policy";

describe("booking-location-policy", () => {
  const originalEncryption = process.env.DENTAL_ENCRYPTION_ENABLED;

  afterEach(() => {
    process.env.DENTAL_ENCRYPTION_ENABLED = originalEncryption;
  });

  beforeEach(() => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";
  });

  it("detects video locations as dental-incompatible", () => {
    expect(isDentalVideoBookingLocation("integrations:daily")).toBe(true);
    expect(isDentalVideoBookingLocation("conferencing")).toBe(true);
    expect(isDentalVideoBookingLocation(DefaultEventLocationTypeEnum.InPerson)).toBe(false);
  });

  it("coerces video locations to in-person", () => {
    expect(
      resolveDentalBookingLocation({
        location: "integrations:daily",
        practiceAddress: "Zahnstraße 1",
      })
    ).toBe(DefaultEventLocationTypeEnum.InPerson);
  });

  it("replaces event locations with clinic address", () => {
    const locations = applyDentalLocationPolicyToEventLocations(
      [{ type: "integrations:daily" }],
      "Praxis am Park 2"
    );

    expect(locations).toEqual([buildDentalInPersonLocation("Praxis am Park 2")]);
  });
});
