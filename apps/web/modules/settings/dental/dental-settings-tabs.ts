export type DentalSettingsTabId =
  | "practice-info"
  | "smart-fill"
  | "recall"
  | "pvs-connector"
  | "treatment-resources";

export type DentalSettingsTab = {
  id: DentalSettingsTabId;
  label: string;
  description: string;
  href: (teamId: number) => string;
};

export const DENTAL_SETTINGS_TABS: DentalSettingsTab[] = [
  {
    id: "practice-info",
    label: "Praxis",
    description: "Adresse & Notfallnummer",
    href: (teamId) => `/settings/practice-info?teamId=${teamId}`,
  },
  {
    id: "smart-fill",
    label: "Smart-Fill",
    description: "Warteliste & Patientenpool",
    href: (teamId) => `/settings/smart-fill?teamId=${teamId}`,
  },
  {
    id: "recall",
    label: "Recall",
    description: "Prophylaxe-Erinnerungen",
    href: (teamId) => `/settings/recall?teamId=${teamId}`,
  },
  {
    id: "treatment-resources",
    label: "Ressourcen",
    description: "Stühle & Räume",
    href: (teamId) => `/settings/treatment-resources?teamId=${teamId}`,
  },
  {
    id: "pvs-connector",
    label: "PVS Sync",
    description: "Praxissoftware-Anbindung",
    href: (teamId) => `/settings/pvs-connector?teamId=${teamId}`,
  },
];
