import dayjs from "@calcom/dayjs";
import type { PrismaClient } from "@calcom/prisma";

import { createDentalLogger } from "../resilience/dental-logger";
import { SMART_FILL_DEFAULT_REVENUE_CENTS, SMART_FILL_LOOKAHEAD_HOURS, SMART_FILL_MIN_GAP_MINUTES } from "./constants";
import { createSmartFillInviteEmailTransport } from "./email/mock-smart-fill-invite-email-transport";
import { isSmartFillEnabled } from "./feature-flags";
import type { SmartFillCronHost } from "./smart-fill-cron-host-loader";
import { invitePatientsForSmartFillTask, shouldSendSmartFillInvite } from "./smart-fill-cron-invite";
import { upsertSmartFillTask } from "./smart-fill-cron-task-upsert";
import { SmartFillPatientSelectionService } from "./smart-fill-patient-selection.service";

const log = createDentalLogger({ module: "smart-fill-cancellation" });

export type CancelledBookingSlot = {
  bookingUid: string;
  teamId: number;
  userId: number;
  eventTypeId: number | null;
  startTime: Date;
  endTime: Date;
};

export type CancellationTriggerResult = {
  taskCreated: boolean;
  invitesSent: number;
};

const SKIPPED: CancellationTriggerResult = { taskCreated: false, invitesSent: 0 };

/**
 * A cancelled slot only qualifies for immediate outreach when it is still in
 * the future, short-notice (within the lookahead window) and long enough to
 * be worth filling.
 */
export function isShortNoticeCancellation(
  slot: Pick<CancelledBookingSlot, "startTime" | "endTime">,
  now: Date = new Date()
): boolean {
  const start = dayjs(slot.startTime);
  if (!start.isAfter(now)) return false;
  if (start.diff(now, "hour") >= SMART_FILL_LOOKAHEAD_HOURS) return false;
  return dayjs(slot.endTime).diff(start, "minute") >= SMART_FILL_MIN_GAP_MINUTES;
}

/**
 * Event-driven Smart-Fill: reacts to a short-notice cancellation (< 48h)
 * immediately instead of waiting for the next cron scan — the freed slot is
 * offered to waitlist/recall patients within seconds of the cancellation.
 */
export async function triggerSmartFillForCancelledBooking(
  prisma: PrismaClient,
  slot: CancelledBookingSlot,
  now: Date = new Date()
): Promise<CancellationTriggerResult> {
  if (!isSmartFillEnabled() || !isShortNoticeCancellation(slot, now)) {
    return SKIPPED;
  }

  const host = await loadHostForCancelledSlot(prisma, slot);
  if (!host) {
    return SKIPPED;
  }

  const { task, created } = await upsertSmartFillTask(
    prisma,
    host,
    { start: slot.startTime, end: slot.endTime },
    `cancellation-${slot.bookingUid}`
  );

  let invitesSent = 0;
  if (await shouldSendSmartFillInvite(prisma, task.id, task.status)) {
    const team = await prisma.team.findUnique({
      where: { id: slot.teamId },
      select: { name: true },
    });

    invitesSent = await invitePatientsForSmartFillTask(
      prisma,
      {
        email: createSmartFillInviteEmailTransport(),
        patientSelection: new SmartFillPatientSelectionService(prisma),
        practiceName: team?.name,
      },
      task.id,
      host
    );
  }

  log.info("Short-notice cancellation processed", {
    bookingUid: slot.bookingUid,
    teamId: slot.teamId,
    taskCreated: created,
    invitesSent,
  });

  return { taskCreated: created, invitesSent };
}

async function loadHostForCancelledSlot(
  prisma: PrismaClient,
  slot: CancelledBookingSlot
): Promise<SmartFillCronHost | null> {
  const user = await prisma.user.findUnique({
    where: { id: slot.userId },
    select: { timeZone: true },
  });

  if (!user) {
    return null;
  }

  const eventType = slot.eventTypeId
    ? await prisma.eventType.findUnique({
        where: { id: slot.eventTypeId },
        select: { title: true },
      })
    : null;

  return {
    teamId: slot.teamId,
    userId: slot.userId,
    timeZone: user.timeZone,
    eventTypeId: slot.eventTypeId,
    eventTypeTitle: eventType?.title ?? null,
    revenueCents: SMART_FILL_DEFAULT_REVENUE_CENTS,
  };
}
