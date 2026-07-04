"use client";

import { isDentalClientComplianceMode } from "@calcom/lib/dental/compliance-config";
import { trpc } from "@calcom/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const EXEMPT_PREFIXES = [
  "/upgrade",
  "/auth",
  "/login",
  "/signup",
  "/onboarding",
  "/settings/my-account",
  "/settings/security",
];

function isExemptPath(pathname: string): boolean {
  return EXEMPT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** Redirects expired trial users to the upgrade page (conversion wall). */
export function PracticeTrialGuard() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const enabled = isDentalClientComplianceMode();

  const { data } = trpc.viewer.practiceTrial.status.useQuery({}, {
    enabled,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!enabled || !data || data.enabled === false || !data.hasPractice) {
      return;
    }

    if (data.isExpired && !isExemptPath(pathname)) {
      router.replace("/upgrade");
    }
  }, [data, enabled, pathname, router]);

  return null;
}
