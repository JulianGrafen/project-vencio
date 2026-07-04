"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PRODUCT_NAME } from "./landing-content";
import { BrandLogo, landingDesign, PrimaryButton } from "./landing-primitives";

const NAV_ITEMS = [
  { href: "#funktionen", label: "Funktionen" },
  { href: "#automation", label: "Smart-Fill" },
  { href: "#compliance", label: "Compliance" },
  { href: "#preise", label: "Preise" },
  { href: "#faq", label: "FAQ" },
] as const;

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className={`${landingDesign.container} flex items-center justify-between gap-4 py-3 md:py-4`}>
        <Link href="/zahnarzt">
          <BrandLogo name={PRODUCT_NAME} />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex" aria-label="Hauptnavigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-[#0F4C81]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/auth/login" className="hidden text-sm font-medium text-slate-600 hover:text-[#0F4C81] sm:inline">
            Anmelden
          </Link>
          <Link href="/auth/login" className={`${landingDesign.btnPrimary} hidden px-4 py-2 text-sm sm:inline-flex`}>
            Kostenlos testen
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileOpen(false)}>
                {item.label}
              </a>
            ))}
            <Link
              href="/auth/login"
              className="rounded-xl px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}>
              Anmelden
            </Link>
            <PrimaryButton href="/auth/login" className="mt-2 w-full text-sm">
              Kostenlos testen
            </PrimaryButton>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
