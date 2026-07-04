"use client";

import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";
import classNames from "@calcom/ui/classNames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { dentalDesign } from "./dental-design";
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
  const pathname = usePathname() ?? "";

  return (
    <SettingsHeader title={title} description={description} CTA={headerAction}>
      <div className={dentalDesign.pageStack}>
        <div className={classNames(dentalDesign.card, "p-4 sm:p-5")}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav
              aria-label="Praxis-Einstellungen"
              className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:flex-wrap lg:pb-0">
              {DENTAL_SETTINGS_TABS.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href(teamId)}
                    className={classNames(
                      "shrink-0 rounded-lg px-3 py-2.5 text-sm transition",
                      isActive
                        ? "bg-teal-700 font-medium text-white shadow-sm"
                        : "text-subtle hover:bg-subtle hover:text-emphasis"
                    )}>
                    <span className="block">{tab.label}</span>
                    <span
                      className={classNames(
                        "mt-0.5 block text-[11px] leading-tight",
                        isActive ? "text-teal-100" : "text-subtle"
                      )}>
                      {tab.description}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <DentalTeamSwitcher teamId={teamId} pathname={pathname} />
          </div>
        </div>

        {children}
      </div>
    </SettingsHeader>
  );
}
