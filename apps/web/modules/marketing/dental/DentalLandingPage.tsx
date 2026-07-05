"use client";

import Link from "next/link";
import { useState } from "react";

import {
  COMPLIANCE_BLOCKS,
  FAQ_ITEMS,
  FEATURES,
  HERO_BULLETS,
  INDUSTRIES,
  PRICING_PLANS,
  PRODUCT_NAME,
  SMART_AUTOMATION,
  TRUST_BADGES,
} from "./landing-content";
import { LandingNav } from "./LandingNav";
import {
  BrandLogo,
  CheckIcon,
  landingDesign,
  PrimaryButton,
  SecondaryButton,
  SectionHeading,
} from "./landing-primitives";

export function DentalLandingPage() {
  const [yearlyBilling, setYearlyBilling] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_50%)]" />
        <div className={`relative ${landingDesign.container} py-16 md:py-24`}>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                {TRUST_BADGES.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-800">
                    {badge}
                  </span>
                ))}
              </div>
              <h1 className={landingDesign.h1}>
                Terminsoftware für Zahnarztpraxen —{" "}
                <span className="text-teal-700">10× effizienter als Telefon & Excel.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                Patienten buchen online. Behandlungsstühle werden parallel geplant. Patientendaten bleiben
                verschlüsselt — entwickelt für deutsche Praxen mit DSGVO-Anforderungen.
              </p>
              <ul className="mt-8 space-y-3">
                {HERO_BULLETS.map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href="/auth/login">Kostenlos testen</PrimaryButton>
                <SecondaryButton href="#demo">Live-Demo ansehen</SecondaryButton>
              </div>
            </div>

            {/* Mock UI */}
            <div id="demo" className={`${landingDesign.card} p-6 shadow-xl shadow-slate-200/50`}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-teal-700">
                Interaktive Vorschau
              </p>
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Schritt 1 — Behandlungsart</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {["Kontrolle", "Prophylaxe", "Füllung", "Schmerztermin"].map((label, i) => (
                      <div
                        key={label}
                        className={`rounded-lg border px-3 py-2 text-sm ${i === 0 ? "border-teal-600 bg-teal-50 font-medium text-teal-900" : "border-slate-200 bg-white text-slate-700"}`}>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Schritt 2 — Ressource & Slot</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800">
                      Stuhl 2 frei
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                      Di, 14:30
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                      Dr. Müller
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  ✓ Patientendaten werden verschlüsselt übertragen · Mandant: Ihre Praxis
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funktionen" className={landingDesign.sectionMuted}>
        <div className={landingDesign.container}>
          <SectionHeading
            eyebrow="Funktionen"
            title="Wie steigert teeth.al die Effizienz im Vergleich zu Telefon & Excel?"
            description="Vom ersten Online-Termin bis zur revisionssicheren Dokumentation — ein durchgängiger Workflow für Ihre Praxis."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className={`${landingDesign.cardHover} p-6`}>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Smart-Fill & Recall */}
      <section id="automation" className="border-t border-slate-100 py-20">
        <div className={landingDesign.container}>
          <SectionHeading
            eyebrow={SMART_AUTOMATION.eyebrow}
            title={SMART_AUTOMATION.title}
            description={SMART_AUTOMATION.description}
          />
          <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {SMART_AUTOMATION.bullets.map((bullet) => (
              <li key={bullet} className={`${landingDesign.card} flex gap-3 p-5 text-sm text-slate-700`}>
                <CheckIcon />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Compliance */}
      <section id="compliance" className="py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Compliance auf Autopilot"
            title="DSGVO und Praxisalltag — ohne Kompromisse"
            description="Aus Patientenbuchungen wird ein kontrollierter Prozess, der Sie bei Datenschutz-Audits und im Tagesgeschäft absichert."
          />
          <div className="grid gap-8 lg:grid-cols-2">
            {COMPLIANCE_BLOCKS.map((block) => (
              <article key={block.title} className="rounded-2xl border border-slate-200 p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{block.eyebrow}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{block.title}</h3>
                <p className="mt-3 text-slate-600">{block.description}</p>
                <ul className="mt-6 space-y-2">
                  {block.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 text-sm text-slate-700">
                      <CheckIcon />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="border-t border-slate-100 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Für Ihre Praxisform"
            title="Gebaut für den Zahnarzt-Alltag"
            description="Ob Einzelpraxis oder MVZ — die Plattform passt sich Ihrer Größe und Ihren Behandlungsabläufen an."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <span className="text-2xl" aria-hidden>
                  {item.emoji}
                </span>
                <h3 className="mt-3 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-8">
              <h3 className="text-xl font-bold text-slate-900">Kein Onboarding-Berg</h3>
              <p className="mt-3 text-slate-600">
                Wer pflegt die Altdaten ein? — Sie nicht. Starten Sie mit Behandlungsarten und Verfügbarkeiten
                in unter einer Stunde. Bestehende Excel-Listen bleiben Archiv, nicht System of Record.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <CheckIcon />
                  Guided Setup für Praxisinhaber
                </li>
                <li className="flex gap-2">
                  <CheckIcon />
                  Kein IT-Projekt in der Praxis
                </li>
                <li className="flex gap-2">
                  <CheckIcon />
                  Umzugsservice ab MVZ-Paket
                </li>
              </ul>
            </article>
            <article className="rounded-2xl border border-teal-200 bg-teal-50 p-8">
              <h3 className="text-xl font-bold text-slate-900">Im Ernstfall zählt Struktur</h3>
              <p className="mt-3 text-slate-700">
                Datenschutzbeauftragte und Aufsicht fragen nicht nach Ihrem guten Willen — sondern nach
                Nachweisen. teeth.al liefert verschlüsselte Speicherung, Mandantentrennung und
                dokumentierte Zugriffe.
              </p>
              <Link
                href="/auth/login"
                className="mt-6 inline-flex rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">
                Compliance-Modus testen →
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preise" className="border-t border-slate-100 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Preise"
            title="Skalieren Sie Ihre Praxis ohne Überraschungen"
            description="Monatlich kündbar oder mit 15 % Rabatt bei Jahreszahlung. Verschlüsselung und Online-Buchung inklusive."
          />
          <div className="mb-10 flex justify-center">
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setYearlyBilling(false)}
                className={`rounded-md px-4 py-2 text-sm font-medium ${!yearlyBilling ? "bg-teal-700 text-white" : "text-slate-600"}`}>
                Monatlich
              </button>
              <button
                type="button"
                onClick={() => setYearlyBilling(true)}
                className={`rounded-md px-4 py-2 text-sm font-medium ${yearlyBilling ? "bg-teal-700 text-white" : "text-slate-600"}`}>
                Jährlich −15 %
              </button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {PRICING_PLANS.map((plan) => {
              const price =
                plan.priceMonthly === null
                  ? null
                  : yearlyBilling
                    ? plan.priceYearly
                    : plan.priceMonthly;

              return (
                <article
                  key={plan.id}
                  className={`flex flex-col rounded-2xl border p-6 ${plan.highlighted ? "border-teal-600 bg-white shadow-lg ring-2 ring-teal-600/20" : "border-slate-200 bg-white"}`}>
                  {plan.highlighted ? (
                    <span className="mb-3 w-fit rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                      Empfohlen
                    </span>
                  ) : null}
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{plan.subtitle}</p>
                  <p className="mt-6 text-3xl font-bold text-slate-900">
                    {price === null ? (
                      "Individuell"
                    ) : price === 0 ? (
                      "0 €"
                    ) : (
                      <>
                        {price} €
                        <span className="text-base font-normal text-slate-500">/Monat</span>
                      </>
                    )}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm text-slate-700">
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/login"
                    className={`mt-8 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                      plan.highlighted
                        ? "bg-teal-700 text-white hover:bg-teal-800"
                        : "border border-slate-300 text-slate-800 hover:border-teal-400"
                    }`}>
                    {plan.cta}
                  </Link>
                </article>
              );
            })}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Alle Preise zzgl. MwSt. · Monatlich kündbar · Kostenlos starten — ohne Kreditkarte.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading
            eyebrow="FAQ"
            title="Häufige Fragen zur Praxis-Terminsoftware"
            description="Kurz, rational und praxisnah — für Praxisinhaber, Datenschutz und Rezeption."
          />
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {FAQ_ITEMS.map((item, index) => (
              <div key={item.question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}>
                  <span className="pr-4 font-semibold text-slate-900">{item.question}</span>
                  <span className="text-xl text-teal-700">{openFaq === index ? "−" : "+"}</span>
                </button>
                {openFaq === index ? (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{item.answer}</div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-100 bg-gradient-to-br from-teal-800 to-teal-900 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">Kostenlos & unverbindlich</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Jetzt teeth.al kostenlos testen</h2>
          <p className="mt-4 text-lg text-teal-100">
            Überzeugen Sie sich selbst — starten Sie in Minuten mit Ihrer Praxis. Wir begleiten Sie beim Setup.
          </p>
          <Link
            href="/auth/login"
            className="mt-8 inline-flex rounded-lg bg-white px-8 py-3 text-base font-semibold text-teal-900 shadow-lg hover:bg-teal-50">
            Kostenlos testen
          </Link>
          <p className="mt-4 text-xs text-teal-200/80">
            100 % kostenlos testen. Mit dem Start stimmen Sie unserer Datenschutzerklärung zu.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <BrandLogo name={PRODUCT_NAME} compact />
            <span className="sm:hidden">{PRODUCT_NAME}</span>
          </div>
          <p className="text-sm text-slate-500">
            Terminsoftware für Zahnarztpraxen · DSGVO-konform · Made in Germany
          </p>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="/auth/login" className="hover:text-teal-700">
              Anmelden
            </Link>
            <a href="#preise" className="hover:text-teal-700">
              Preise
            </a>
            <a href="#faq" className="hover:text-teal-700">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
