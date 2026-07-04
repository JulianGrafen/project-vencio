import { randomUUID } from "node:crypto";

import { prisma } from "@calcom/prisma";
import { BookingStatus, SmartFillInviteStatus, SmartFillTaskStatus } from "@calcom/prisma/enums";

export type SeedSmartFillInviteParams = {
  teamId: number;
  userId: number;
  eventTypeId: number;
  confirmToken?: string;
  withHoldBooking?: boolean;
};

export async function seedSmartFillInvite(params: SeedSmartFillInviteParams) {
  const confirmToken = params.confirmToken ?? randomUUID();
  const startTime = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
  const phoneBlindIndex = `e2e-${randomUUID().slice(0, 8)}`;

  const patient = await prisma.smartFillPatient.create({
    data: {
      teamId: params.teamId,
      name: "E2E Patient",
      email: "e2e-patient@example.com",
      phoneNumber: "+491701234567",
      phoneBlindIndex,
      waitlistEnabled: true,
    },
  });

  let holdBookingUid: string | undefined;
  if (params.withHoldBooking) {
    holdBookingUid = `hold-${randomUUID().slice(0, 8)}`;
    await prisma.booking.create({
      data: {
        uid: holdBookingUid,
        title: "Smart-Fill Hold",
        startTime,
        endTime,
        status: BookingStatus.PENDING,
        userId: params.userId,
        eventTypeId: params.eventTypeId,
      },
    });
  }

  const task = await prisma.smartFillTask.create({
    data: {
      teamId: params.teamId,
      userId: params.userId,
      eventTypeId: params.eventTypeId,
      startTime,
      endTime,
      durationMinutes: 30,
      status: SmartFillTaskStatus.INVITED,
      metadata: holdBookingUid ? { holdBookingUid } : undefined,
    },
  });

  const invite = await prisma.smartFillInvite.create({
    data: {
      taskId: task.id,
      patientId: patient.id,
      status: SmartFillInviteStatus.SENT,
      confirmToken,
    },
  });

  return { patient, task, invite, confirmToken, holdBookingUid, startTime, endTime };
}
