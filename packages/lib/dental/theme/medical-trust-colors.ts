/**
 * teeth.al "Medical Trust" palette — single source of truth for dental booking UI.
 * Consumed by CSS custom properties and programmatic brand-color hooks.
 */
export const MEDICAL_TRUST_COLORS = {
  primary: "#0F4C81",
  primaryEmphasis: "#0B3D66",
  primaryMuted: "#E8F1F8",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  success: "#059669",
  successSubtle: "#ECFDF5",
  danger: "#E11D48",
  dangerSubtle: "#FFF1F2",
  text: "#1E293B",
  textMuted: "#64748B",
  border: "#E2E8F0",
} as const;

export type MedicalTrustColorKey = keyof typeof MEDICAL_TRUST_COLORS;
