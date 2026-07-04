import dayjs from "@calcom/dayjs";

import { SMART_FILL_DEFAULT_TREATMENT_TITLE } from "./constants";

type InviteSmsParams = {
  patientName: string;
  slotStart: Date;
  timeZone: string;
  treatmentTitle?: string | null;
};

export function buildSmartFillInviteSmsBody(params: InviteSmsParams): string {
  const treatment = params.treatmentTitle ?? SMART_FILL_DEFAULT_TREATMENT_TITLE;
  const startFormatted = dayjs(params.slotStart).tz(params.timeZone).format("DD.MM. HH:mm");

  return `Guten Tag ${params.patientName}, in der Praxis ist am ${startFormatted} ein Termin frei geworden (${treatment}). Antworten Sie mit JA zur Bestätigung.`;
}
