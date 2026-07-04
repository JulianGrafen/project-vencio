import type { PrismaClient } from "@calcom/prisma";
import { SmartFillTaskStatus } from "@calcom/prisma/enums";

import type { SmartFillCronHost } from "./smart-fill-cron-host-loader";
import {
  lockSmartFillTaskForInvite,
  rollbackSmartFillInvite,
} from "./smart-fill-invite-lifecycle";
import { SmartFillPatientSelectionService } from "./smart-fill-patient-selection.service";
import { buildSmartFillInviteSmsBody } from "./smart-fill-sms-message";
import type { SmsService } from "./sms/sms-service.interface";

/** Only invite once per task — prevents duplicate SMS on every cron run. */
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
    sms: SmsService;
    patientSelection: SmartFillPatientSelectionService;
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

  const body = buildSmartFillInviteSmsBody({
    patientName: patient.name,
    slotStart: lockedInvite.task.startTime,
    timeZone: host.timeZone,
    treatmentTitle: host.eventTypeTitle,
  });

  try {
    const smsResult = await deps.sms.send({
      to: patient.phoneNumber,
      body,
      teamId: host.teamId,
      metadata: { taskId, patientId: patient.id },
    });

    await prisma.smartFillInvite.update({
      where: { id: lockedInvite.inviteId },
      data: { messageSid: smsResult.messageSid },
    });

    return 1;
  } catch {
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
