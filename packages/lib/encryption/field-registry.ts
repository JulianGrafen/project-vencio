import type { ModelFieldRegistry } from "./types";

/**
 * Central registry of fields requiring application-level encryption.
 * Namespace: dental fork — upstream Cal.com fields remain untouched unless listed here.
 */
export const ENCRYPTED_FIELD_REGISTRY: Record<string, ModelFieldRegistry> = {
  Attendee: {
    email: { classification: "P1_PII", blindIndex: true, blindIndexField: "emailBlindIndex" },
    name: { classification: "P1_PII" },
    phoneNumber: { classification: "P1_PII", blindIndex: true, blindIndexField: "phoneBlindIndex" },
  },
  Booking: {
    description: { classification: "P0_HEALTH" },
    responses: { classification: "P0_HEALTH", json: true },
    customInputs: { classification: "P0_HEALTH", json: true },
    metadata: { classification: "P1_PII", json: true },
    smsReminderNumber: { classification: "P1_PII" },
    cancellationReason: { classification: "P0_HEALTH" },
    rejectionReason: { classification: "P0_HEALTH" },
    reassignReason: { classification: "P0_HEALTH" },
    ratingFeedback: { classification: "P0_HEALTH" },
    userPrimaryEmail: { classification: "P1_PII", blindIndex: true, blindIndexField: "userPrimaryEmailBlindIndex" },
    location: { classification: "P1_PII" },
  },
  BookingInternalNote: {
    text: { classification: "P0_HEALTH" },
  },
  VideoCallGuest: {
    email: { classification: "P1_PII" },
    name: { classification: "P1_PII" },
  },
};

export const HEALTH_DATA_GUARD_FIELDS = new Set([
  "description",
  "cancellationReason",
  "rejectionReason",
  "reassignReason",
  "ratingFeedback",
  "notes",
  "text",
  "responses",
  "customInputs",
]);

export function getEncryptedFieldsForModel(model: string): ModelFieldRegistry | undefined {
  return ENCRYPTED_FIELD_REGISTRY[model];
}
