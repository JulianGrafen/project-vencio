import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  GENERIC_DENTAL_BOOKING_TITLE,
  TOKEN_BOOKING_METADATA_KEY,
  TOKEN_BOOKING_REFERENCE_KEY,
} from "./types";
import { minimizeBookingSensitiveData, sealBookingSensitiveData } from "./seal-booking-sensitive-data";

describe("seal-booking-sensitive-data", () => {
  const { publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const baseInput = {
    teamId: 7,
    bookingUid: "booking-uid-1",
    startTimeIso: "2026-07-04T10:00:00.000Z",
    title: "Professionelle Zahnreinigung (45 Min)",
    description: "Patient hat Empfindlichkeit",
    location: "integrations:zoom",
    responses: {
      email: "patient@example.com",
      name: "Max Mustermann",
      insuranceType: "GESETZLICH",
      dateOfBirth: "01.01.1980",
    },
    customInputs: { foo: "bar" },
    attendees: [{ name: "Max Mustermann", email: "patient@example.com", phoneNumber: "+491701234567" }],
  };

  it("seals sensitive fields into encryptedPayload", () => {
    const result = sealBookingSensitiveData({
      ...baseInput,
      practicePublicKey: { teamId: 7, publicKeyPem: publicKey, keyVersion: 1 },
    });

    expect(result.title).toBe(GENERIC_DENTAL_BOOKING_TITLE);
    expect(result.description).toBeNull();
    expect(result.location).toBe("Praxis-Besuch");
    expect(result.responses).toEqual({
      email: "patient@example.com",
      insuranceType: "GESETZLICH",
    });
    expect(result.attendees[0]?.name).toBe("Patient");
    expect(typeof result.metadata[TOKEN_BOOKING_METADATA_KEY]).toBe("string");
    expect(typeof result.metadata[TOKEN_BOOKING_REFERENCE_KEY]).toBe("string");
  });

  it("minimizes data when no public key is configured", () => {
    const result = minimizeBookingSensitiveData(baseInput);

    expect(result.title).toBe(GENERIC_DENTAL_BOOKING_TITLE);
    expect(result.metadata[TOKEN_BOOKING_METADATA_KEY]).toBeUndefined();
    expect(result.responses?.email).toBe("patient@example.com");
    expect(result.responses?.name).toBeUndefined();
  });
});
