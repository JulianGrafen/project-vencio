import type { AppointmentSyncDTO } from "./types/appointment-sync.dto";
import type { PvsOutboxJobDTO } from "./types/outbox.dto";

export function parseOutboxJob(
  job: PvsOutboxJobDTO
): { ok: true; payload: AppointmentSyncDTO } | { ok: false; error: string } {
  if (!job.id?.trim()) {
    return { ok: false, error: "Missing job id" };
  }
  if (!job.bookingUid?.trim()) {
    return { ok: false, error: "Missing bookingUid" };
  }
  if (!job.teamId || job.teamId <= 0) {
    return { ok: false, error: "Invalid teamId" };
  }

  const payload = job.payload;
  if (!payload?.patientEmail?.trim()) {
    return { ok: false, error: "Missing patientEmail in payload" };
  }
  if (!payload?.startTime?.trim() || !payload?.endTime?.trim()) {
    return { ok: false, error: "Missing appointment times in payload" };
  }

  return { ok: true, payload };
}

export function resolvePvsAppointmentRef(payload: AppointmentSyncDTO, provider: string) {
  return {
    externalId: payload.pvsExternalId?.trim() || payload.bookingUid,
    provider,
  };
}
