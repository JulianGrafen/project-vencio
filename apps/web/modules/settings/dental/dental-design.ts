/** Shared Tailwind class bundles for dental B2B UI — Medical Trust palette. */
export const dentalDesign = {
  /** Primary brand accent (#0F4C81) */
  accentText: "text-[#0F4C81] dark:text-[#7EB8E8]",
  accentBg: "bg-[#0F4C81]",
  accentBgSoft: "bg-[#E8F1F8] dark:bg-[#0F4C81]/10",
  accentBorder: "border-[#BFDBFE] dark:border-[#0F4C81]/40",

  /** Surfaces */
  card: "rounded-xl border border-subtle bg-default shadow-sm",
  cardMuted: "rounded-xl border border-subtle bg-[#F8FAFC] dark:bg-subtle/30",
  cardInteractive:
    "rounded-xl border border-subtle bg-default shadow-sm transition hover:border-[#BFDBFE] hover:shadow-md",

  /** Typography */
  eyebrow: "text-xs font-semibold uppercase tracking-wider text-[#0F4C81] dark:text-[#7EB8E8]",
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
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F1F8] text-sm font-semibold text-[#0F4C81] dark:bg-[#0F4C81]/20 dark:text-[#7EB8E8]",
} as const;

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
