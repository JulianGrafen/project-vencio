import {
  getCalendarCredentials,
  getConnectedCalendars,
} from "@calcom/features/calendars/lib/CalendarManager";
import { buildNonDelegationCredentials } from "@calcom/lib/delegationCredential";
import { prisma } from "@calcom/prisma";
import { credentialForCalendarServiceSelect } from "@calcom/prisma/selects/credential";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { checkInvalidAppCredentials } from "./checkForInvalidAppCredentials";
import { shouldVerifyEmailHandler } from "./shouldVerifyEmail.handler";
import { isDentalTwoFactorSetupRequiredForUser } from "@calcom/lib/dental/two-factor-policy";
import { PracticeTrialService } from "@calcom/lib/dental/trial/trial.service";
import { isPracticeTrialEnabled } from "@calcom/lib/dental/trial/trial-feature-flags";

const getUpgradeableHandler = async (..._args: unknown[]) => null;
const checkIfOrgNeedsUpgradeHandler = async (..._args: unknown[]) => false;

type Props = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

const _checkInvalidGoogleCalendarCredentials = async ({ ctx }: Props) => {
  const userCredentials = await prisma.credential.findMany({
    where: {
      userId: ctx.user.id,
      type: "google_calendar",
    },
    select: credentialForCalendarServiceSelect,
  });

  // TODO: Call top buildNonDelegationCredentials here can be avoided by moving credential prisma query to repository.
  const calendarCredentials = getCalendarCredentials(buildNonDelegationCredentials(userCredentials));

  const { connectedCalendars } = await getConnectedCalendars(
    calendarCredentials,
    ctx.user.userLevelSelectedCalendars,
    ctx.user.destinationCalendar?.externalId
  );

  return connectedCalendars.some((calendar) => !!calendar.error);
};

async function getPracticeTrialBanner(userId: number) {
  if (!isPracticeTrialEnabled()) {
    return null;
  }

  const service = new PracticeTrialService(prisma);
  const eligibility = await service.getEligibilityForUser(userId);
  if (!eligibility || !eligibility.eligible) {
    return null;
  }

  return {
    daysRemaining: eligibility.daysRemaining,
    bookingsRemaining: eligibility.bookingsRemaining,
    trialBookingsCount: eligibility.trialBookingsCount,
  };
}

export const getUserTopBannersHandler = async ({ ctx }: Props) => {
  const upgradeableTeamMememberships = getUpgradeableHandler({ userId: ctx.user.id });
  const upgradeableOrgMememberships = checkIfOrgNeedsUpgradeHandler({ ctx });
  const shouldEmailVerify = shouldVerifyEmailHandler({ ctx });
  // const isInvalidCalendarCredential = checkInvalidGoogleCalendarCredentials({ ctx });
  const appsWithInavlidCredentials = checkInvalidAppCredentials({ ctx });

  const [
    teamUpgradeBanner,
    orgUpgradeBanner,
    verifyEmailBanner,
    invalidAppCredentialBanners,
    dentalTwoFactorBanner,
    practiceTrialBanner,
  ] = await Promise.allSettled([
    upgradeableTeamMememberships,
    upgradeableOrgMememberships,
    shouldEmailVerify,
    appsWithInavlidCredentials,
    isDentalTwoFactorSetupRequiredForUser({
      userId: ctx.user.id,
      twoFactorEnabled: ctx.user.twoFactorEnabled,
      identityProvider: ctx.user.identityProvider,
    }),
    getPracticeTrialBanner(ctx.user.id),
  ]);

  return {
    teamUpgradeBanner: teamUpgradeBanner.status === "fulfilled" ? teamUpgradeBanner.value : [],
    orgUpgradeBanner: orgUpgradeBanner.status === "fulfilled" ? orgUpgradeBanner.value : [],
    verifyEmailBanner: verifyEmailBanner.status === "fulfilled" ? !verifyEmailBanner.value.isVerified : false,
    calendarCredentialBanner: false,
    invalidAppCredentialBanners:
      invalidAppCredentialBanners.status === "fulfilled" ? invalidAppCredentialBanners.value : [],
    dueInvoiceBanner: null,
    dentalTwoFactorBanner:
      dentalTwoFactorBanner.status === "fulfilled" && dentalTwoFactorBanner.value ? true : null,
    practiceTrialBanner:
      practiceTrialBanner.status === "fulfilled" ? practiceTrialBanner.value : null,
  };
};
