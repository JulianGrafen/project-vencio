"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Icon } from "@calcom/ui/components/icon";

const DENTAL_FEATURES = [
  {
    title: "dental_signup_feature_booking_title",
    description: "dental_signup_feature_booking_description",
    icon: "calendar-heart" as const,
  },
  {
    title: "dental_signup_feature_recall_title",
    description: "dental_signup_feature_recall_description",
    icon: "mail" as const,
  },
  {
    title: "dental_signup_feature_compliance_title",
    description: "dental_signup_feature_compliance_description",
    icon: "shield-check" as const,
  },
] as const;

const TREATMENT_KEYS = [
  "dental_signup_treatment_checkup",
  "dental_signup_treatment_prophylaxis",
  "dental_signup_treatment_filling",
  "dental_signup_treatment_emergency",
] as const;

export function DentalSignupShowcase() {
  const { t } = useLocale();

  return (
    <>
      <div className="hidden rounded-tl-2xl rounded-br-none rounded-bl-2xl border border-default border-r-0 border-dashed bg-black/3 p-6 lg:block dark:bg-white/5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-emphasis">
          {t("dental_signup_preview_label")}
        </p>
        <div className="space-y-4">
          <div className="rounded-xl border border-subtle bg-default p-4">
            <p className="text-sm font-medium text-subtle">{t("dental_signup_step_treatment")}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {TREATMENT_KEYS.map((key, index) => (
                <div
                  key={key}
                  className={
                    index === 0
                      ? "rounded-lg border border-emphasis bg-emphasis/10 px-3 py-2 text-sm font-medium text-emphasis"
                      : "rounded-lg border border-subtle bg-default px-3 py-2 text-sm text-subtle"
                  }>
                  {t(key)}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-subtle bg-default p-4">
            <p className="text-sm font-medium text-subtle">{t("dental_signup_step_slot")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-emphasis/10 px-3 py-1 text-xs font-medium text-emphasis">
                {t("dental_signup_chair_available")}
              </span>
              <span className="rounded-full border border-subtle bg-default px-3 py-1 text-xs font-medium text-subtle">
                {t("dental_signup_slot_example")}
              </span>
              <span className="rounded-full border border-subtle bg-default px-3 py-1 text-xs font-medium text-subtle">
                {t("dental_signup_dentist_example")}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-300">
            {t("dental_signup_compliance_note")}
          </div>
        </div>
      </div>
      <div className="mt-8 mr-12 hidden h-full w-full grid-cols-3 gap-4 overflow-hidden lg:grid">
        {DENTAL_FEATURES.map((feature) => (
          <div key={feature.title} className="mb-8 flex max-w-52 flex-col leading-none sm:mb-0">
            <div className="items-center text-emphasis">
              <Icon name={feature.icon} className="mb-1 h-4 w-4" />
              <span className="font-medium text-sm">{t(feature.title)}</span>
            </div>
            <div className="text-sm text-subtle">
              <p>{t(feature.description)}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
