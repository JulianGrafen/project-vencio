"use client";

import { trpc } from "@calcom/trpc/react";
import { Select } from "@calcom/ui/components/form";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type TeamOption = { label: string; value: number };

type DentalTeamSwitcherProps = {
  teamId: number;
  pathname: string;
};

export function DentalTeamSwitcher({ teamId, pathname }: DentalTeamSwitcherProps) {
  const router = useRouter();

  const { data, isLoading } = trpc.viewer.loggedInViewerRouter.teamsAndUserProfilesQuery.useQuery({});

  const options = useMemo<TeamOption[]>(() => {
    if (!data) return [];
    return data
      .filter((entry): entry is typeof entry & { teamId: number } => entry.teamId !== null)
      .map((entry) => ({
        label: entry.name ?? `Team ${entry.teamId}`,
        value: entry.teamId,
      }));
  }, [data]);

  const selected = options.find((option) => option.value === teamId) ?? options[0];

  if (isLoading || options.length <= 1) {
    return selected ? (
      <p className="text-subtle text-sm">
        Praxis: <span className="text-emphasis font-medium">{selected.label}</span>
      </p>
    ) : null;
  }

  return (
    <div className="w-full max-w-xs">
      <Select<TeamOption, false>
        inputId="dental-team-switcher"
        isSearchable={false}
        options={options}
        value={selected}
        onChange={(option) => {
          if (!option || option.value === teamId) return;
          router.push(`${pathname}?teamId=${option.value}`);
        }}
      />
    </div>
  );
}
