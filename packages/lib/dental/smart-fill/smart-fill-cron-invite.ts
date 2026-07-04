import type { PrismaClient } from "@calcom/prisma";
import { SmartFillTaskStatus } from "@calcom/prisma/enums";

import { createDentalLogger } from "../resilience/dental-logger";
import type { SmartFillCronHost } from "./smart-fill-cron-host-loader";
import {
  lockSmartFillTaskForInvite,
  rollbackSmartFillInvite,
} from "./smart-fill-invite-lifecycle";
import { SmartFillPatientSelectionService } from "./smart-fill-patient-selection.service";
import { buildSmartFillInviteEmail } from "./smart-fill-invite-email";
import type { SmartFillInviteEmailTransport } from "./email/smart-fill-invite-email-transport.interface";

const inviteLog = createDentalLogger({ module: "smart-fill-cron-invite" });

/** Only invite once per task — prevents duplicate emails on every cron run. */
export async function shouldSendSmartFillInvite(
  prisma: PrismaClient,
  taskId: string,
  status: SmartFillTaskStatus
): Promise<boolean> {
  if (status !== SmartFillTaskStatus.PENDING) {
    return false;
  }

  const existingInvites = await prisma.smartFillInvite.count({
    where: { taskId },
  });

  return existingInvites === 0;
}

export async function invitePatientsForSmartFillTask(
  prisma: PrismaClient,
  deps: {
    email: SmartFillInviteEmailTransport;
    patientSelection: SmartFillPatientSelectionService;
    practiceName?: string | null;
  },
  taskId: string,
  host: SmartFillCronHost
): Promise<number> {
  const patients = await deps.patientSelection.selectCandidates({
    teamId: host.teamId,
    eventTypeId: host.eventTypeId,
    limit: 1,
  });

  if (patients.length === 0) return 0;

  const patient = patients[0];

  if (!patient.email?.trim()) {
    inviteLog.warn("Smart-Fill invite skipped — patient has no email", {
      taskId,
      teamId: host.teamId,
      patientId: patient.id,
    });
    return 0;
  }

  const lockedInvite = await prisma.$transaction((tx) =>
    lockSmartFillTaskForInvite(tx, {
      taskId,
      patientId: patient.id,
      host,
    })
  );

  if (!lockedInvite) {
    return 0;
  }

  const emailPayload = buildSmartFillInviteEmail({
    patientName: patient.name,
    patientEmail: patient.email,
    slotStart: lockedInvite.task.startTime,
    timeZone: host.timeZone,
    treatmentTitle: host.eventTypeTitle,
    practiceName: deps.practiceName,
    confirmToken: lockedInvite.confirmToken,
  });

  try {
    const emailResult = await deps.email.send(emailPayload);

    await prisma.smartFillInvite.update({
      where: { id: lockedInvite.inviteId },
      data: { messageSid: emailResult.messageId },
    });

    return 1;
  } catch (error) {
    inviteLog.warn("Smart-Fill email invite failed — rolling back", {
      taskId,
      teamId: host.teamId,
      patientId: patient.id,
      error: error instanceof Error ? error.message : String(error),
    });
    await prisma.$transaction((tx) =>
      rollbackSmartFillInvite(tx, {
        taskId,
        inviteId: lockedInvite.inviteId,
        taskMetadata: lockedInvite.task.metadata,
      })
    );
    return 0;
  }
}
