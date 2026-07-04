import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";

import type { AppointmentSyncDTO } from "@calcom/pvs-integration";

import { isPvsOutboxSealedStub, sealPvsOutboxPayload } from "./seal-pvs-outbox-payload";

describe("seal-pvs-outbox-payload", () => {
  const { publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const dto: AppointmentSyncDTO = {
    bookingUid: "uid-1",
    teamId: 3,
    patientName: "Max Mustermann",
    patientEmail: "max@example.com",
    startTime: "2026-07-04T10:00:00.000Z",
    endTime: "2026-07-04T10:30:00.000Z",
    title: "Prophylaxe",
    source: "booker",
  };

  it("seals full DTO into encryptedPayload with operational stub", () => {
    const sealed = sealPvsOutboxPayload(dto, {
      teamId: 3,
      publicKeyPem: publicKey,
      keyVersion: 1,
    });

    expect(isPvsOutboxSealedStub(sealed.payload)).toBe(true);
    expect(sealed.payload.bookingUid).toBe("uid-1");
    expect(sealed.encryptedPayload.startsWith("enc:hybrid:v1:")).toBe(true);
    expect(sealed.payloadVersion).toBe(1);
  });
});
