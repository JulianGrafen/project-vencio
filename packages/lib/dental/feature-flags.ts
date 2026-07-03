/**
 * Server-side dental feature gate.
 * Lives in the dental domain layer — encryption/compliance code imports from here.
 */
export function isDentalEncryptionEnabled(): boolean {
  return process.env.DENTAL_ENCRYPTION_ENABLED === "true" || process.env.DENTAL_ENCRYPTION_ENABLED === "1";
}
