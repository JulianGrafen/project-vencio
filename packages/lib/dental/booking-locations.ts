import {
  DefaultEventLocationTypeEnum,
  type LocationObject,
} from "@calcom/app-store/locations";

import { isDentalComplianceMode } from "./compliance-config";

const VIDEO_LOCATION_PREFIX = "integrations:";

const DENTAL_ALLOWED_DEFAULT_LOCATIONS = new Set<DefaultEventLocationTypeEnum>([
  DefaultEventLocationTypeEnum.InPerson,
  DefaultEventLocationTypeEnum.AttendeeInPerson,
  DefaultEventLocationTypeEnum.SomewhereElse,
]);

/**
 * Video/conferencing locations (Zoom, Meet, Teams, …) are irrelevant for in-practice dental visits.
 */
export function isVideoConferencingLocationType(type: string): boolean {
  return type.startsWith(VIDEO_LOCATION_PREFIX) || type === DefaultEventLocationTypeEnum.Conferencing;
}

export function isDentalPracticeLocationType(type: string): boolean {
  if (isVideoConferencingLocationType(type)) {
    return false;
  }
  if (type in DefaultEventLocationTypeEnum) {
    return DENTAL_ALLOWED_DEFAULT_LOCATIONS.has(type as DefaultEventLocationTypeEnum);
  }
  return type === DefaultEventLocationTypeEnum.InPerson;
}

/**
 * Restricts bookable locations to in-practice options when dental compliance mode is on.
 */
export function filterDentalBookingLocations(locations: LocationObject[]): LocationObject[] {
  if (!isDentalComplianceMode()) {
    return locations;
  }

  const practiceLocations = locations.filter((location) => isDentalPracticeLocationType(location.type));

  if (practiceLocations.length > 0) {
    return practiceLocations;
  }

  return [
    {
      type: DefaultEventLocationTypeEnum.InPerson,
      address: "",
    },
  ];
}
