import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { isDentalComplianceMode } from "@calcom/lib/dental/compliance-config";
import { isSmartFillEnabled } from "@calcom/lib/dental/smart-fill/feature-flags";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";

import { buildLegacyRequest } from "@lib/buildLegacyCtx";

import { SmartFillPatientPoolView } from "~/settings/smart-fill/SmartFillPatientPoolView";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Smart-Fill Patientenpool",
    () => "Warteliste und Recall für automatische Termin-Einladungen per SMS",
    undefined,
    undefined,
    "/settings/smart-fill"
  );

type PageProps = {
  searchParams: Promise<{ teamId?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  if (!isDentalComplianceMode() || !isSmartFillEnabled()) {
    redirect("/settings/my-account/general");
  }

  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/settings/smart-fill");
  }

  const params = await searchParams;
  const teamId = Number(params.teamId);
  if (!teamId || Number.isNaN(teamId)) {
    redirect("/settings/my-account/general");
  }

  return <SmartFillPatientPoolView teamId={teamId} />;
};

export default Page;
