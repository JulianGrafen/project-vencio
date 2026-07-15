import { DENTAL_CONTACT_EMAIL, DENTAL_PROVIDER_NAME } from "@calcom/lib/dental/contact";

/** Public contact e-mail shown on Impressum and upgrade/contact CTAs. */
export const IMPRESSUM_EMAIL = DENTAL_CONTACT_EMAIL;

export const IMPRESSUM_PROVIDER_NAME = DENTAL_PROVIDER_NAME;

export const IMPRESSUM_CONTENT = {
  title: "Impressum",
  legalHeading: "Angaben gemäß § 5 TMG",
  providerLabel: "Diensteanbieter",
  contactHeading: "Kontakt",
  emailLabel: "E-Mail",
  disclaimerHeading: "Haftung für Inhalte",
  disclaimer:
    "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
} as const;
