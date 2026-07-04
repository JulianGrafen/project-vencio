import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { isDentalComplianceMode } from "@calcom/lib/dental/compliance-config";
import { isRecallEnabled } from "@calcom/lib/dental/recall/feature-flags";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";

import { buildLegacyRequest } from "@lib/buildLegacyCtx";

import { DentalSettingsEntry } from "~/settings/dental/DentalSettingsEntry";
import { RecallSettingsView } from "~/settings/recall/RecallSettingsView";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Recall",
    () => "Prophylaxe-Erinnerungen automatisch versenden",
    undefined,
    undefined,
    "/settings/recall"
  );

type PageProps = {
  searchParams: Promise<{ teamId?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  if (!isDentalComplianceMode() || !isRecallEnabled()) {
    redirect("/settings/my-account/general");
  }

  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/settings/recall");
  }

  const params = await searchParams;
  const teamId = Number(params.teamId);

  return (
    <DentalSettingsEntry teamId={Number.isNaN(teamId) ? 0 : teamId}>
      <RecallSettingsView teamId={teamId} />
    </DentalSettingsEntry>
  );
};

export default Page;
