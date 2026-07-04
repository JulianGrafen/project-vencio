"use client";

import { INSURANCE_BOOKING_FIELD_NAME } from "@calcom/lib/dental/medical-categories/constants";
import { parseInsuranceType } from "@calcom/lib/dental/medical-categories/medical-categories";
import type { InsuranceType } from "@calcom/prisma/enums";
import { useState } from "react";

import { InsuranceTriage } from "./InsuranceTriage";
import type { MedicalEventTypeItem } from "./MedicalEventTypeList";
import { MedicalEventTypeList } from "./MedicalEventTypeList";

type DentalBookingDirectoryProps = {
  username: string;
  eventTypes: MedicalEventTypeItem[];
  query: Record<string, string | string[] | undefined>;
};

/**
 * Patient-facing booking directory: insurance triage first, then treatment
 * categories. Deep links (e.g. from recall emails) may preselect the
 * insurance via the ?insuranceType= query param.
 */
export function DentalBookingDirectory({ username, eventTypes, query }: DentalBookingDirectoryProps) {
  const [insuranceType, setInsuranceType] = useState<InsuranceType | null>(() =>
    parseInsuranceType(query[INSURANCE_BOOKING_FIELD_NAME])
  );

  return (
    <>
      <InsuranceTriage selected={insuranceType} onSelect={setInsuranceType} />
      {insuranceType ? (
        <MedicalEventTypeList
          username={username}
          eventTypes={eventTypes}
          insuranceType={insuranceType}
          query={query}
        />
      ) : (
        <p className="text-subtle py-6 text-center text-sm" data-testid="triage-hint">
          Bitte wählen Sie zuerst Ihre Versicherungsart, um verfügbare Behandlungen zu sehen.
        </p>
      )}
    </>
  );
}
