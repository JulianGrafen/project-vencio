export const PRODUCT_NAME = "teeth.al";

export const TRUST_BADGES = [
  "DSGVO-konform",
  "Made in Germany",
  "Ende-zu-Ende verschlüsselt",
  "EU-Hosting",
] as const;

export const HERO_BULLETS = [
  "Online-Termine in 30 Sekunden — ohne Telefon-Marathon",
  "Smart-Fill AI füllt Leerlauf-Slots per E-Mail automatisch",
  "Prophylaxe-Recall — Patienten kommen von selbst zurück",
  "Behandlungsstuhl & Raum parallel zum Zahnarzt buchen",
  "Patientendaten verschlüsselt — nicht in Excel-Listen",
] as const;

export const SMART_AUTOMATION = {
  eyebrow: "Smart-Fill AI & Recall",
  title: "Leere Slots füllen sich von selbst — Recall bringt Patienten zurück",
  description:
    "Warteliste, E-Mail-Einladungen bei kurzfristigen Absagen und automatische Prophylaxe-Erinnerungen — ohne Excel und Telefon-Marathon.",
  bullets: [
    "Smart-Fill: freie Termine per E-Mail an Wartelisten-Patienten",
    "Recall: E-Mail-Erinnerungen nach konfigurierbarem Intervall (z. B. 6 Monate)",
    "PVS-Sync: Termine direkt ins Praxisverwaltungssystem",
    "Praxis-Dashboard mit KPIs auf der Event-Types-Seite",
  ],
} as const;

export const FEATURES = [
  {
    title: "Smart-Fill & Prophylaxe-Recall",
    description:
      "Kurzfristig frei gewordene Slots werden per E-Mail an Wartelisten-Patienten vergeben. Recall erinnert automatisch an die nächste Prophylaxe — mit DSGVO Opt-out.",
  },
  {
    title: "Termine in Sekunden online buchen",
    description:
      "Patienten wählen Behandlungsart, Zahnarzt und freien Slot — ohne Anruf bei der Rezeption. Weniger Unterbrechungen im Behandlungsalltag.",
  },
  {
    title: "Web-basiert — sofort einsatzbereit",
    description:
      "Kein Download, keine Server in der Praxis: Browser auf Desktop, Tablet und Smartphone. Ihr Team startet in Minuten, nicht in Monaten.",
  },
  {
    title: "Ressourcen statt nur Kalender",
    description:
      "Behandlungsstühle, Räume und Röntgen parallel zum Behandler planen — Doppelbuchungen und Leerläufe werden sichtbar statt im Kopf verwaltet.",
  },
  {
    title: "DSGVO by Design",
    description:
      "Verschlüsselte Patientendaten, Mandantentrennung pro Praxis und konfigurierbare Tracking-Sperren — entwickelt für deutsches Gesundheitsrecht.",
  },
  {
    title: "Mehrere Standorte & Teams",
    description:
      "MVZ, Filialpraxen und Gemeinschaftspraxen zentral verwalten — mit klarer Trennung pro Team und rollenbasiertem Zugriff.",
  },
  {
    title: "Immer audit-ready",
    description:
      "Lückenlose Buchungshistorie, verschlüsselte Felder und nachvollziehbare Zugriffe — die Basis für Datenschutz-Audits und interne QS.",
  },
] as const;

export const COMPLIANCE_BLOCKS = [
  {
    eyebrow: "Patientendaten",
    title: "Kein WhatsApp- und Excel-Chaos mehr",
    description:
      "Ein digitales Buchungssystem statt Tabellen, Zettelwirtschaft und unsicherer Messenger-Ketten. Patientendaten werden verschlüsselt gespeichert — nicht doppelt in Ordnern.",
    bullets: [
      "Verschlüsselte Namen, E-Mails und Formularantworten",
      "Blind-Index nur für berechtigte Praxis-Suche",
      "Keine US-Tracking-Skripte im Compliance-Modus",
    ],
  },
  {
    eyebrow: "Nachvollziehbarkeit",
    title: "Jede Buchung ist dokumentiert",
    description:
      "Wer wann gebucht, verschoben oder storniert hat, bleibt nachvollziehbar — essenziell für Datenschutzbeauftragte und Praxisinhaber.",
    bullets: [
      "Tenant-Kontext pro Praxis-Team",
      "Fail-closed bei fehlendem Praxis-Kontext",
      "Exportierbare Übersichten für interne Prüfungen",
    ],
  },
  {
    eyebrow: "Vor Ort",
    title: "Rezeption entlasten, Patienten zufrieden",
    description:
      "Self-Service-Buchung rund um die Uhr — mit klaren Behandlungsarten, Versicherungshinweisen und Erinnerungen per E-Mail.",
    bullets: [
      "Deutschsprachiger Booker für Patienten",
      "Individuelle Behandlungsarten pro Zahnarzt",
      "Automatische Kalender-Synchronisation",
    ],
  },
  {
    eyebrow: "Ressourcenplanung",
    title: "Stuhl, Raum, Gerät — alles im Blick",
    description:
      "Treatment Resources blockieren Slots, wenn Stuhl oder Röntgen belegt ist — nicht erst wenn der Patient im Wartezimmer sitzt.",
    bullets: [
      "Eigene Arbeitszeitpläne pro Ressource",
      "Parallele Belegung von Arzt und Stuhl",
      "Admin-UI für Praxisleitung",
    ],
  },
] as const;

export const INDUSTRIES = [
  { emoji: "🦷", title: "Einzelpraxis", examples: "Prophylaxe, Füllungen, Kontrollen" },
  { emoji: "🏥", title: "MVZ & Gemeinschaft", examples: "Mehrere Behandler, geteilte Ressourcen" },
  { emoji: "😁", title: "Kieferorthopädie", examples: "Lange Behandlungszyklen, Recall-Termine" },
  { emoji: "👶", title: "Kinderzahnheilkunde", examples: "Eltern buchen online, kurze Slots" },
  { emoji: "🔬", title: "Implantologie", examples: "Mehrstufige Behandlungen, OP-Räume" },
  { emoji: "📸", title: "Röntgen & Diagnostik", examples: "Geräte-Ressourcen getrennt planen" },
] as const;

export const PRICING_PLANS = [
  {
    id: "test",
    name: "Test",
    subtitle: "Unverbindlich prüfen.",
    priceMonthly: 0,
    priceYearly: 0,
    cta: "Kostenlos testen",
    highlighted: false,
    features: [
      "1 Zahnarzt",
      "5 Behandlungsarten",
      "Online-Buchung für Patienten",
      "DSGVO-Basis-Konfiguration",
    ],
  },
  {
    id: "praxis",
    name: "Praxis",
    subtitle: "Für Einzelpraxen und kleine Teams.",
    priceMonthly: 89,
    priceYearly: 76,
    cta: "Praxis starten",
    highlighted: false,
    features: [
      "Bis 5 Behandler",
      "Behandlungsressourcen (Stuhl/Raum)",
      "Smart-Fill Warteliste & E-Mail",
      "Prophylaxe-Recall (E-Mail)",
      "Verschlüsselung Patientendaten",
      "E-Mail-Erinnerungen",
      "E-Mail-Support",
    ],
  },
  {
    id: "mvz",
    name: "MVZ",
    subtitle: "Maximale Effizienz für wachsende Praxen.",
    priceMonthly: 199,
    priceYearly: 169,
    cta: "Demo vereinbaren",
    highlighted: true,
    features: [
      "Unbegrenzte Behandler",
      "Multi-Standort-Verwaltung",
      "Priorisierter Support",
      "Onboarding-Begleitung",
      "PVS-Connector (Dampsoft, Z1, …)",
      "Individuelle Behandlungsformulare",
      "Compliance-Dokumentation",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "Für Kliniken und Praxisgruppen.",
    priceMonthly: null,
    priceYearly: null,
    cta: "Angebot einholen",
    highlighted: false,
    features: [
      "Dedizierte EU-Infrastruktur",
      "BYOK / eigene Schlüssel",
      "SSO & SAML",
      "SLA & Audit-Begleitung",
      "Custom Integrationen (PVS, Röntgen)",
    ],
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Lohnt sich das wirklich, wenn wir weiter telefonisch buchen?",
    answer:
      "Telefonische Buchung skaliert nicht: Rezeption blockiert, Fehler passieren bei Notizen, und außerhalb der Sprechzeiten gehen Termine verloren. teeth.al entlastet das Team und gibt Patienten 24/7-Self-Service — ohne Kalender-Chaos in Excel.",
  },
  {
    question: "Ist das DSGVO-konform für Patientendaten?",
    answer:
      "Ja. Patientendaten werden verschlüsselt gespeichert, pro Praxis isoliert und nur im Praxis-Kontext entschlüsselt. Tracking und Drittanbieter-Analytics lassen sich im Compliance-Modus deaktivieren. AVV und EU-Hosting sind Teil des Konzepts.",
  },
  {
    question: "Was passiert mit unseren bestehenden Terminlisten?",
    answer:
      "Sie starten mit leerem System und legen Behandlungsarten sowie Verfügbarkeiten an — typischerweise in unter einer Stunde. Bestehende Termine aus PVS-Systemen können schrittweise migriert werden; ein geführter Umzugsservice ist im MVZ-Paket enthalten.",
  },
  {
    question: "Brauchen wir IT in der Praxis?",
    answer:
      "Nein. Die Lösung läuft im Browser. Sie benötigen nur Internetzugang. Updates, Backups und Verschlüsselung liegen auf der Plattform — nicht auf einem PC in der Abstellkammer.",
  },
  {
    question: "Können mehrere Behandler und Stühle parallel gebucht werden?",
    answer:
      "Ja. Behandlungsressourcen (Stuhl, Raum, Röntgen) werden parallel zum Zahnarzt geplant. So vermeiden Sie Doppelbelegungen, die in reinen Personen-Kalendern unsichtbar bleiben.",
  },
  {
    question: "Wo werden die Daten gespeichert?",
    answer:
      "Empfohlen wird EU-Hosting (z. B. Hetzner Frankfurt oder vergleichbar). Schlüsselmaterial liegt getrennt von der Datenbank — nicht im Klartext in Konfigurationsdateien.",
  },
] as const;
