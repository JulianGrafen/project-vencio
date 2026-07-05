import {
  DefaultEventLocationTypeEnum,
  type LocationObject,
  OrganizerDefaultConferencingAppType,
} from "@calcom/app-store/locations";

import { isDentalClientComplianceMode, isDentalComplianceMode } from "./compliance-config";
import { isVideoConferencingLocationType } from "./booking-locations";
import { resolveDentalPracticeAddressFromContext } from "./team-metadata";

function isDentalLocationPolicyActive(): boolean {
  return isDentalComplianceMode() || isDentalClientComplianceMode();
}

export const DENTAL_IN_PERSON_LOCATION_TYPE = DefaultEventLocationTypeEnum.InPerson;

export function isDentalVideoBookingLocation(location: string | null | undefined): boolean {
  if (!location?.trim()) {
    return true;
  }

  return (
    location === OrganizerDefaultConferencingAppType ||
    isVideoConferencingLocationType(location) ||
    location === "integrations:daily"
  );
}

export function buildDentalInPersonLocation(practiceAddress?: string | null): LocationObject {
  return {
    type: DENTAL_IN_PERSON_LOCATION_TYPE,
    address: practiceAddress?.trim() ?? "",
  };
}

export function resolveDentalBookingLocation(params: {
  location: string | null | undefined;
  practiceAddress?: string | null;
}): string {
  if (!isDentalComplianceMode()) {
    return params.location?.trim() || "";
  }

  if (isDentalVideoBookingLocation(params.location)) {
    return DENTAL_IN_PERSON_LOCATION_TYPE;
  }

  return params.location?.trim() || DENTAL_IN_PERSON_LOCATION_TYPE;
}

export function applyDentalLocationPolicyToEventLocations(
  locations: LocationObject[],
  practiceAddress?: string | null
): LocationObject[] {
  if (!isDentalLocationPolicyActive()) {
    return locations;
  }

  const address =
    practiceAddress?.trim() ||
    locations.find((location) => location.type === DENTAL_IN_PERSON_LOCATION_TYPE)?.address?.trim() ||
    "";

  const practiceLocations = locations.filter((location) => !isVideoConferencingLocationType(location.type));

  if (practiceLocations.some((location) => location.type === DENTAL_IN_PERSON_LOCATION_TYPE)) {
    return practiceLocations.map((location) =>
      location.type === DENTAL_IN_PERSON_LOCATION_TYPE ? { ...location, address } : location
    );
  }

  return [buildDentalInPersonLocation(address)];
}

export function resolveDentalPracticeAddressForBooking(params: {
  teamMetadata?: unknown;
  userMetadata?: unknown;
  eventTypeLocations?: LocationObject[];
}): string | undefined {
  const fromContext = resolveDentalPracticeAddressFromContext({
    teamMetadata: params.teamMetadata,
    userMetadata: params.userMetadata,
  });

  if (fromContext) {
    return fromContext;
  }

  const fromEventType = params.eventTypeLocations
    ?.find((location) => location.type === DENTAL_IN_PERSON_LOCATION_TYPE)
    ?.address?.trim();

  return fromEventType || undefined;
}
