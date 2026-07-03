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
