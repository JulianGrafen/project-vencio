/** Shared Tailwind class bundles for dental B2B UI. */
export const dentalDesign = {
  /** Primary brand accent */
  accentText: "text-teal-700 dark:text-teal-400",
  accentBg: "bg-teal-700",
  accentBgSoft: "bg-teal-50 dark:bg-teal-950/30",
  accentBorder: "border-teal-200 dark:border-teal-800",

  /** Surfaces */
  card: "rounded-xl border border-subtle bg-default shadow-sm",
  cardMuted: "rounded-xl border border-subtle bg-subtle/30",
  cardInteractive: "rounded-xl border border-subtle bg-default shadow-sm transition hover:border-teal-200 hover:shadow-md",

  /** Typography */
  eyebrow: "text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400",
  pageSectionTitle: "text-base font-semibold text-emphasis",
  pageSectionDesc: "text-subtle mt-1 text-sm leading-relaxed",

  /** Layout */
  pageStack: "space-y-8",
  formGrid: "grid gap-4 sm:grid-cols-2",

  /** Lists */
  listContainer: "divide-subtle divide-y overflow-hidden rounded-xl border border-subtle bg-default shadow-sm",
  listRow: "flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between",

  /** Avatar */
  avatar:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800 dark:bg-teal-900/50 dark:text-teal-200",
} as const;

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
