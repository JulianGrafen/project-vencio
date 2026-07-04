import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { isDentalComplianceMode } from "@calcom/lib/dental/compliance-config";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";

import { buildLegacyRequest } from "@lib/buildLegacyCtx";

import { DentalSettingsEntry } from "~/settings/dental/DentalSettingsEntry";
import { PvsConnectorSettingsView } from "~/settings/pvs-connector/PvsConnectorSettingsView";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "PVS Connector",
    () => "API-Schlüssel für die Synchronisation mit dem Praxisverwaltungssystem",
    undefined,
    undefined,
    "/settings/pvs-connector"
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
    redirect("/auth/login?callbackUrl=/settings/pvs-connector");
  }

  const params = await searchParams;
  const teamId = Number(params.teamId);

  return (
    <DentalSettingsEntry teamId={Number.isNaN(teamId) ? 0 : teamId}>
      <PvsConnectorSettingsView teamId={teamId} />
    </DentalSettingsEntry>
  );
};

export default Page;
