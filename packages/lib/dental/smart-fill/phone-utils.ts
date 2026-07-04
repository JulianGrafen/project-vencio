/**
 * Normalizes phone numbers for consistent Smart-Fill patient lookup.
 * Strips whitespace and converts leading 00 to +.
 */
export function normalizePhoneNumber(phone: string): string {
  const trimmed = phone.replace(/\s+/g, "");
  if (trimmed.startsWith("00")) {
    return `+${trimmed.slice(2)}`;
  }
  if (trimmed.startsWith("+")) {
    return trimmed;
  }
  return trimmed;
}

/** Placeholder when phone is omitted — Smart-Fill uses email; keeps unique constraint satisfied. */
export function resolveSmartFillPatientPhone(phone: string | undefined, email: string): string {
  if (phone?.trim()) {
    return normalizePhoneNumber(phone);
  }
  const slug = email.trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12).padEnd(12, "0");
  return `+499${slug}`;
}
