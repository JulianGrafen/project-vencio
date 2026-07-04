export type ResourceTypeOption = { label: string; value: "CHAIR" | "ROOM" | "XRAY" };

export const RESOURCE_TYPES: ResourceTypeOption[] = [
  { label: "Behandlungsstuhl", value: "CHAIR" },
  { label: "Behandlungsraum", value: "ROOM" },
  { label: "Röntgen", value: "XRAY" },
];

export const RESOURCE_TYPE_LABELS: Record<ResourceTypeOption["value"], string> = {
  CHAIR: "Behandlungsstuhl",
  ROOM: "Behandlungsraum",
  XRAY: "Röntgen",
};

export type ScheduleOption = { label: string; value: number | null };

export function formatScheduleLabel(schedule: { name: string; timeZone: string | null }) {
  return schedule.timeZone ? `${schedule.name} (${schedule.timeZone})` : schedule.name;
}
