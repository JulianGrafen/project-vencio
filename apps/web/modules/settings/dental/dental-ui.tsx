import type { ReactNode } from "react";

import classNames from "@calcom/ui/classNames";

import { dentalDesign } from "./dental-design";

type DentalCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "accent";
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function DentalCard({
  children,
  className,
  variant = "default",
  padding = "md",
}: DentalCardProps) {
  const variantClass =
    variant === "muted"
      ? dentalDesign.cardMuted
      : variant === "accent"
        ? classNames(dentalDesign.card, dentalDesign.accentBorder, dentalDesign.accentBgSoft)
        : dentalDesign.card;

  return (
    <div className={classNames(variantClass, paddingMap[padding], className)}>{children}</div>
  );
}

type DentalSectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  count?: number;
};

export function DentalSectionHeader({ title, description, action, count }: DentalSectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h3 className={dentalDesign.pageSectionTitle}>{title}</h3>
          {count !== undefined ? (
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-900/40 dark:text-teal-200">
              {count}
            </span>
          ) : null}
        </div>
        {description ? <p className={dentalDesign.pageSectionDesc}>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

type DentalAvatarProps = {
  name: string;
};

export function DentalAvatar({ name }: DentalAvatarProps) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?";

  return (
    <span className={dentalDesign.avatar} aria-hidden>
      {initials}
    </span>
  );
}

type DentalStatTileProps = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

export function DentalStatTile({ label, value, highlight }: DentalStatTileProps) {
  return (
    <div
      className={classNames(
        "rounded-lg border p-4",
        highlight ? classNames(dentalDesign.accentBorder, dentalDesign.accentBgSoft) : "border-subtle bg-subtle/20"
      )}>
      <p className="text-subtle text-xs font-medium">{label}</p>
      <p className={classNames("mt-1 text-2xl font-bold tabular-nums", highlight ? "text-teal-800" : "text-emphasis")}>
        {value}
      </p>
    </div>
  );
}

type DentalHelpTextProps = {
  children: ReactNode;
};

export function DentalHelpText({ children }: DentalHelpTextProps) {
  return <p className="text-subtle mt-1.5 text-xs leading-relaxed">{children}</p>;
}
