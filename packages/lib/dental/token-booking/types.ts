import { z } from "zod";

/** Versioned envelope stored in Booking.metadata.encryptedPayload */
export const TOKEN_BOOKING_PAYLOAD_VERSION = 1;

export const TOKEN_BOOKING_METADATA_KEY = "encryptedPayload" as const;
export const TOKEN_BOOKING_REFERENCE_KEY = "bookingReferenceHash" as const;
export const TOKEN_BOOKING_SEAL_KEY = "tokenBookingSeal" as const;

/** Fields moved out of plaintext columns into the asymmetric encrypted blob. */
export const tokenBookingSensitivePayloadSchema = z.object({
  v: z.literal(TOKEN_BOOKING_PAYLOAD_VERSION),
  /** Event type title at booking time (may imply treatment category — Art. 9). */
  treatmentLabel: z.string().optional(),
  bookerDisplayName: z.string().optional(),
  additionalNotes: z.string().optional(),
  customInputs: z.unknown().optional(),
  /** Full booking form responses (insurance, DOB, Erstpatient, …). */
  responses: z.record(z.unknown()).optional(),
  attendeeNames: z.array(z.string()).optional(),
  locationDetail: z.string().optional(),
});

export type TokenBookingSensitivePayload = z.infer<typeof tokenBookingSensitivePayloadSchema>;

export type TokenBookingSealMetadata = {
  version: typeof TOKEN_BOOKING_PAYLOAD_VERSION;
  algorithm: "RSA-OAEP-AES-256-GCM";
  teamId: number;
  keyVersion: number;
  sealedAt: string;
};

export const GENERIC_DENTAL_BOOKING_TITLE = "Behandlungstermin";

/** Verification-only fields that may remain in Booking.responses (still envelope-encrypted by Prisma extension). */
export const TOKEN_BOOKING_VERIFICATION_RESPONSE_KEYS = new Set([
  "email",
  "attendeePhoneNumber",
  "phone",
  "smsReminderNumber",
  "insuranceType",
]);
