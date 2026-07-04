"use client";

import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";
import classNames from "@calcom/ui/classNames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { DENTAL_SETTINGS_TABS, type DentalSettingsTabId } from "./dental-settings-tabs";
import { DentalTeamSwitcher } from "./DentalTeamSwitcher";

type DentalSettingsShellProps = {
  teamId: number;
  activeTab: DentalSettingsTabId;
  title: string;
  description: string;
  children: ReactNode;
  headerAction?: ReactNode;
};

export function DentalSettingsShell({
  teamId,
  activeTab,
  title,
  description,
  children,
  headerAction,
}: DentalSettingsShellProps) {
  const pathname = usePathname();

  return (
    <SettingsHeader title={title} description={description} CTA={headerAction}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Praxis-Einstellungen" className="flex flex-wrap gap-2">
            {DENTAL_SETTINGS_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <Link
                  key={tab.id}
                  href={tab.href(teamId)}
                  className={classNames(
                    "rounded-lg border px-3 py-2 text-sm transition",
                    isActive
                      ? "border-emphasis bg-emphasis text-emphasis font-medium"
                      : "border-subtle text-subtle hover:border-default hover:text-emphasis"
                  )}>
                  <span>{tab.label}</span>
                  <span className="text-subtle ml-1 hidden text-xs sm:inline">· {tab.description}</span>
                </Link>
              );
            })}
          </nav>
          <DentalTeamSwitcher teamId={teamId} pathname={pathname} />
        </div>

        {children}
      </div>
    </SettingsHeader>
  );
}
