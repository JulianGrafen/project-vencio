/**
 * teeth.al domain vocabulary — maps Cal.com concepts to dental practice terminology.
 * Used in UI copy and API responses without renaming database tables (upstream compatibility).
 */
export const DENTAL_DOMAIN_LABELS = {
  host: "Behandler",
  hosts: "Behandler",
  attendee: "Patient",
  attendees: "Patienten",
  eventType: "Behandlungsart",
  eventTypes: "Behandlungsarten",
  booking: "Termin",
  bookings: "Termine",
  team: "Praxis",
  teams: "Praxen",
  user: "Zahnarzt",
  organizer: "Behandler",
} as const;

export type DentalDomainLabelKey = keyof typeof DENTAL_DOMAIN_LABELS;

export function getDentalDomainLabel(key: DentalDomainLabelKey): string {
  return DENTAL_DOMAIN_LABELS[key];
}
