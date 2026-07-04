export type AppointmentSyncDTO = {
  bookingUid: string;
  teamId: number;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  startTime: string;
  endTime: string;
  title: string;
  eventTypeId?: number | null;
  source: "smart-fill" | "booker" | "api";
  smartFillTaskId?: string;
  cancellationReason?: string;
  rescheduledToBookingUid?: string;
  /** PVS appointment ID from a completed CREATE sync — used for cancel/update. */
  pvsExternalId?: string;
};

export type PvsAppointmentRef = {
  externalId: string;
  provider: string;
};
