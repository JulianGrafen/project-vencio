import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { isDentalComplianceMode } from "@calcom/lib/dental/compliance-config";

import { buildLegacyRequest } from "@lib/buildLegacyCtx";

import { DentalSettingsEntry } from "~/settings/dental/DentalSettingsEntry";
import { MedicalCategoriesSettingsView } from "~/settings/medical-categories/MedicalCategoriesSettingsView";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Behandlungskategorien",
    () => "Medizinische Kategorien und Versicherungs-Einschränkungen für Terminarten",
    undefined,
    undefined,
    "/settings/medical-categories"
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
    redirect("/auth/login?callbackUrl=/settings/medical-categories");
  }

  const params = await searchParams;
  const teamId = Number(params.teamId);

  return (
    <DentalSettingsEntry teamId={Number.isNaN(teamId) ? 0 : teamId}>
      <MedicalCategoriesSettingsView teamId={teamId} />
    </DentalSettingsEntry>
  );
};

export default Page;
