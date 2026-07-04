import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { isDentalComplianceMode } from "@calcom/lib/dental/compliance-config";

import { buildLegacyRequest } from "@lib/buildLegacyCtx";

import { UpgradePageView } from "~/trial/UpgradePageView";

export default async function UpgradePage() {
  if (!isDentalComplianceMode()) {
    redirect("/event-types");
  }

  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/upgrade");
  }

  return <UpgradePageView />;
}
