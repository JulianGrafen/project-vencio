import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PraxisTermin — Terminsoftware für Zahnarztpraxen | DSGVO-konform",
  description:
    "Online-Terminbuchung für Zahnarztpraxen: Behandlungsstühle parallel planen, Patientendaten verschlüsselt, DSGVO-konform. 10× effizienter als Telefon und Excel.",
  openGraph: {
    title: "PraxisTermin — Terminsoftware für Zahnarztpraxen",
    description:
      "DSGVO-konforme Terminbuchung mit Ressourcenplanung für Stühle, Räume und Röntgen — Made in Germany.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return children;
}
