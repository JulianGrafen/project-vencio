import type { ReactNode } from "react";

export const landingDesign = {
  container: "mx-auto max-w-6xl px-4 md:px-6",
  section: "py-20 md:py-24",
  sectionMuted: "border-t border-slate-100 bg-slate-50/60 py-20 md:py-24",
  eyebrow: "mb-3 text-sm font-semibold uppercase tracking-wider text-teal-700",
  h1: "text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl lg:text-[3.25rem]",
  h2: "text-3xl font-bold tracking-tight text-slate-900 md:text-4xl",
  body: "text-lg leading-relaxed text-slate-600",
  card: "rounded-2xl border border-slate-200 bg-white shadow-sm",
  cardHover: "rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-200 hover:shadow-md",
  btnPrimary:
    "inline-flex items-center justify-center rounded-xl bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700",
  btnSecondary:
    "inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-800",
} as const;

export function CheckIcon() {
  return (
    <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      {eyebrow ? <p className={landingDesign.eyebrow}>{eyebrow}</p> : null}
      <h2 className={landingDesign.h2}>{title}</h2>
      {description ? <p className="mt-4 text-lg text-slate-600">{description}</p> : null}
    </div>
  );
}

export function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={`${landingDesign.btnPrimary} ${className}`}>
      {children}
    </a>
  );
}

export function SecondaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={`${landingDesign.btnSecondary} ${className}`}>
      {children}
    </a>
  );
}

export function BrandLogo({ name, compact }: { name: string; compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 font-semibold text-slate-900">
      <span
        className={`flex items-center justify-center rounded-xl bg-teal-700 font-bold text-white shadow-sm ${compact ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm"}`}>
        PT
      </span>
      {!compact ? <span>{name}</span> : null}
    </span>
  );
}
