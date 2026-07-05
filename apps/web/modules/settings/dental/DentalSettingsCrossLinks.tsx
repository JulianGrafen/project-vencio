import Link from "next/link";

type DentalSettingsCrossLinksProps = {
  teamId: number;
  current?: "practice-info" | "pvs-connector" | "smart-fill" | "treatment-resources";
};

const LINKS = [
  {
    id: "practice-info" as const,
    label: "Praxisinformationen",
    href: (teamId: number) => `/settings/practice-info?teamId=${teamId}`,
  },
  { id: "pvs-connector" as const, label: "PVS Connector", href: (teamId: number) => `/settings/pvs-connector?teamId=${teamId}` },
  { id: "smart-fill" as const, label: "Smart-Fill Patientenpool", href: (teamId: number) => `/settings/smart-fill?teamId=${teamId}` },
  {
    id: "treatment-resources" as const,
    label: "Behandlungsressourcen",
    href: (teamId: number) => `/settings/treatment-resources?teamId=${teamId}`,
  },
];

export function DentalSettingsCrossLinks({ teamId, current }: DentalSettingsCrossLinksProps) {
  return (
    <div className="text-subtle flex flex-wrap gap-4 text-sm">
      {LINKS.filter((link) => link.id !== current).map((link) => (
        <Link key={link.id} className="text-emphasis underline" href={link.href(teamId)}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
