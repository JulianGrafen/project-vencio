import { prisma } from "@calcom/prisma";
import { resolveTeamIdFromBookingUid } from "@calcom/lib/dental/practice-team-resolver";
import { runWithDentalPracticeContext } from "@calcom/lib/dental/run-with-dental-context";

import type { TrpcSessionUser } from "../../../types";
import type { TGetBookingDetailsInputSchema } from "./getBookingDetails.schema";

type GetBookingDetailsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetBookingDetailsInputSchema;
};

export const getBookingDetailsHandler = async ({ ctx, input }: GetBookingDetailsOptions) => {
  const { BookingDetailsService } = await import("@calcom/features/bookings/services/BookingDetailsService");
  const bookingDetailsService = new BookingDetailsService(prisma);
  const teamId = await resolveTeamIdFromBookingUid(prisma, input.uid);

  return runWithDentalPracticeContext(
    { teamId, operation: "decrypt", actorUserId: ctx.user.id },
    () =>
      bookingDetailsService.getBookingDetails({
        userId: ctx.user.id,
        bookingUid: input.uid,
      })
  );
};
