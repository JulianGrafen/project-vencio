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
};

export type PvsAppointmentRef = {
  externalId: string;
  provider: string;
};
