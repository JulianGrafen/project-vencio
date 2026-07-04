import type { PrismaClient } from "@calcom/prisma";
import { SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";
import { randomUUID } from "node:crypto";

import { enqueueBookingPvsSyncIfEnabled } from "../pvs/enqueue-booking-pvs-sync";
import { finalizeSmartFillBooking } from "./smart-fill-booking-finalizer";
import { SMART_FILL_BOOKING_SOURCE, SMART_FILL_DEFAULT_BOOKING_TITLE } from "./constants";
import type { SmartFillActiveInvite } from "./smart-fill-reply.types";
import { parseSmartFillTaskMetadata } from "./smart-fill-slot-hold";

/**
 * Shared confirm transaction for email links and legacy SMS replies.
 * Optimistic-locks the task, finalizes booking, updates invite/patient, enqueues PVS sync.
 */
export async function confirmSmartFillInvite(
  prisma: PrismaClient,
  invite: SmartFillActiveInvite,
  replyBody: string
): Promise<string> {
  const { patient } = invite;
  const holdBookingUid = parseSmartFillTaskMetadata(invite.task.metadata).holdBookingUid;
  const bookingUid = holdBookingUid ?? randomUUID();

  const result = await prisma.$transaction(async (tx) => {
    const locked = await tx.smartFillTask.updateMany({
      where: { id: invite.taskId, status: SmartFillTaskStatus.INVITED },
      data: { status: SmartFillTaskStatus.CONFIRMED, bookingUid },
    });

    if (locked.count === 0) {
      const existing = await tx.smartFillTask.findUnique({ where: { id: invite.taskId } });
      if (existing?.status === SmartFillTaskStatus.CONFIRMED && existing.bookingUid) {
        return { bookingUid: existing.bookingUid };
      }
      throw new Error(`SmartFillTask ${invite.taskId} is no longer invitable`);
    }

    await finalizeSmartFillBooking(tx, {
      bookingUid,
      holdBookingUid,
      task: {
        id: invite.task.id,
        teamId: invite.task.teamId,
        userId: invite.task.userId,
        eventTypeId: invite.task.eventTypeId,
        startTime: invite.task.startTime,
        endTime: invite.task.endTime,
        eventTypeTitle: invite.task.eventType?.title,
      },
      patient: {
        email: patient.email,
        name: patient.name,
        timeZone: invite.task.user.timeZone,
        locale: patient.locale,
      },
    });

    await tx.smartFillInvite.update({
      where: { id: invite.id },
      data: {
        status: SmartFillInviteStatus.REPLIED_YES,
        repliedAt: new Date(),
        replyBody,
      },
    });

    await tx.smartFillPatient.update({
      where: { id: patient.id },
      data: { lastVisitAt: invite.task.startTime },
    });

    const title = invite.task.eventType?.title ?? SMART_FILL_DEFAULT_BOOKING_TITLE;
    await enqueueBookingPvsSyncIfEnabled(tx, {
      bookingUid,
      teamId: invite.task.teamId,
      patientName: patient.name,
      patientEmail: patient.email,
      patientPhone: patient.phoneNumber,
      startTime: invite.task.startTime,
      endTime: invite.task.endTime,
      title,
      eventTypeId: invite.task.eventTypeId,
      source: SMART_FILL_BOOKING_SOURCE,
      smartFillTaskId: invite.task.id,
    });

    return { bookingUid };
  });

  return result.bookingUid;
}
