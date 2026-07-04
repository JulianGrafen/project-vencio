import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { isDentalComplianceMode } from "@calcom/lib/dental/compliance-config";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { prisma } from "@calcom/prisma";

import { buildLegacyRequest } from "@lib/buildLegacyCtx";

/**
 * Entry point for Praxis settings — redirects to practice info with the user's first team.
 */
const Page = async () => {
  if (!isDentalComplianceMode()) {
    redirect("/settings/my-account/general");
  }

  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/settings/practice");
  }

  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      accepted: true,
      team: { isOrganization: false },
    },
    orderBy: { team: { name: "asc" } },
    select: { teamId: true },
  });

  if (!membership) {
    redirect("/settings/practice-info");
  }

  redirect(`/settings/practice-info?teamId=${membership.teamId}`);
};

export default Page;
