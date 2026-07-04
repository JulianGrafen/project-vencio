import Link from "next/link";

import { PRACTICE_TRIAL_DURATION_DAYS, PRACTICE_TRIAL_MAX_BOOKINGS } from "@calcom/lib/dental/trial/trial.constants";
import { Button } from "@calcom/ui/components/button";
import { Icon } from "@calcom/ui/components/icon";

const FEATURES = [
  {
    title: "PVS-Integration",
    description: "Termine automatisch in Dampsoft & Co. — ohne Doppelbuchungen.",
    icon: "refresh-cw" as const,
  },
  {
    title: "Smart-Fill AI",
    description: "Leere Slots per SMS an Wartelisten-Patienten — mehr Auslastung.",
    icon: "zap" as const,
  },
  {
    title: "Prophylaxe-Recall",
    description: "Automatische Erinnerungen mit Opt-out — DSGVO-konform.",
    icon: "mail" as const,
  },
  {
    title: "Verschlüsselung & 2FA",
    description: "Praxisdaten in der EU — Field-Level Encryption für Patientendaten.",
    icon: "lock" as const,
  },
] as const;

export function UpgradePageView() {
  return (
    <div className="bg-subtle min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="text-center">
          <p className="text-teal-700 text-sm font-semibold uppercase tracking-wide">PraxisTermin Vollversion</p>
          <h1 className="text-emphasis font-cal mt-3 text-3xl font-bold sm:text-4xl">
            Ihre Testphase ist beendet
          </h1>
          <p className="text-subtle mx-auto mt-4 max-w-2xl text-base sm:text-lg">
            Upgrade auf die Vollversion, um weiterhin Termine zu verwalten, Smart-Fill zu nutzen und mit Ihrer
            Praxissoftware zu synchronisieren — ohne Kreditkarte bei der ersten Anfrage.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="border-muted bg-default rounded-xl border p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-teal-50 text-teal-800 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-emphasis font-medium">{feature.title}</h2>
                  <p className="text-subtle mt-1 text-sm">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-muted bg-default mx-auto mt-10 max-w-lg rounded-2xl border p-8 text-center shadow-sm">
          <p className="text-subtle text-sm">
            Beta-Test: {PRACTICE_TRIAL_DURATION_DAYS} Tage · {PRACTICE_TRIAL_MAX_BOOKINGS} Termine kostenlos
          </p>
          <p className="text-emphasis font-cal mt-2 text-4xl font-bold">Auf Anfrage</p>
          <p className="text-subtle mt-1 text-sm">Individuelles Praxis-Paket · monatlich kündbar</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button color="primary" href="mailto:hello@praxistermin.de?subject=Upgrade%20PraxisTermin">
              Upgrade anfragen
            </Button>
            <Button color="secondary" href="/settings/my-account/general">
              Account-Einstellungen
            </Button>
          </div>
        </div>

        <p className="text-subtle mt-8 text-center text-sm">
          Fragen?{" "}
          <Link href="mailto:hello@praxistermin.de" className="text-teal-700 underline">
            hello@praxistermin.de
          </Link>
        </p>
      </div>
    </div>
  );
}
