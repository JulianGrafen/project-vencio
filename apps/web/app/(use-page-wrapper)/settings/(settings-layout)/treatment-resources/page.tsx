import { createRouterCaller } from "app/_trpc/context";
import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { isDentalComplianceMode } from "@calcom/lib/dental/compliance-config";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";

import { buildLegacyRequest } from "@lib/buildLegacyCtx";

import { DentalSettingsEntry } from "~/settings/dental/DentalSettingsEntry";
import { TreatmentResourcesSettingsView } from "~/settings/treatment-resources/TreatmentResourcesSettingsView";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Behandlungsressourcen",
    () => "Verwaltung von Behandlungsstühlen und -räumen",
    undefined,
    undefined,
    "/settings/treatment-resources"
  );

type PageProps = {
  searchParams: Promise<{ teamId?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  if (!isDentalComplianceMode()) {
    redirect("/settings/my-account/general");
  }

  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/settings/treatment-resources");
  }

  const params = await searchParams;
  const teamId = Number(params.teamId);

  return (
    <DentalSettingsEntry teamId={Number.isNaN(teamId) ? 0 : teamId}>
      <TreatmentResourcesSettingsView teamId={teamId} />
    </DentalSettingsEntry>
  );
};

export default Page;
