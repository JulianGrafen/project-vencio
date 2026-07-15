import type { Metadata } from "next";
import Link from "next/link";

import {
  IMPRESSUM_CONTENT,
  IMPRESSUM_EMAIL,
  IMPRESSUM_PROVIDER_NAME,
} from "@calcom/web/modules/marketing/dental/impressum-content";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Kontaktdaten gemäß § 5 TMG",
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <Link href="/zahnarzt" className="text-sm font-medium text-[#0F4C81] hover:underline">
          ← Zurück
        </Link>

        <h1 className="mt-8 text-3xl font-bold tracking-tight">{IMPRESSUM_CONTENT.title}</h1>

        <section className="mt-10 space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{IMPRESSUM_CONTENT.legalHeading}</h2>
          <p className="text-sm text-slate-500">{IMPRESSUM_CONTENT.providerLabel}</p>
          <p className="text-base font-medium">{IMPRESSUM_PROVIDER_NAME}</p>
        </section>

        <section className="mt-10 space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{IMPRESSUM_CONTENT.contactHeading}</h2>
          <p className="text-sm text-slate-500">{IMPRESSUM_CONTENT.emailLabel}</p>
          <a
            href={`mailto:${IMPRESSUM_EMAIL}`}
            className="text-base font-medium text-[#0F4C81] hover:underline">
            {IMPRESSUM_EMAIL}
          </a>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{IMPRESSUM_CONTENT.disclaimerHeading}</h2>
          <p className="text-sm leading-relaxed text-slate-600">{IMPRESSUM_CONTENT.disclaimer}</p>
        </section>
      </div>
    </main>
  );
}
