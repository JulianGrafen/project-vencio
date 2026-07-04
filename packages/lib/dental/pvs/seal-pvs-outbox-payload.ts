import type { AppointmentSyncDTO } from "@calcom/pvs-integration";

import { encryptWithPracticePublicKey } from "../crypto/hybrid-public-key-crypto";
import type { PracticeBookingPublicKey } from "../token-booking/practice-public-key.service";

export const PVS_OUTBOX_PAYLOAD_VERSION = 1;

export type PvsOutboxSealedStub = {
  _sealed: true;
  bookingUid: string;
  teamId: number;
  payloadVersion: number;
};

export type SealedPvsOutboxStorage = {
  payload: PvsOutboxSealedStub;
  encryptedPayload: string;
  payloadVersion: number;
};

export function isPvsOutboxSealedStub(payload: unknown): payload is PvsOutboxSealedStub {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "_sealed" in payload &&
    (payload as PvsOutboxSealedStub)._sealed === true
  );
}

/**
 * Seals PVS sync payload with practice public key. Cloud stores only the encrypted blob;
 * on-prem connector decrypts with the practice private key.
 */
export function sealPvsOutboxPayload(
  dto: AppointmentSyncDTO,
  practicePublicKey: PracticeBookingPublicKey
): SealedPvsOutboxStorage {
  const encryptedPayload = encryptWithPracticePublicKey(
    JSON.stringify(dto),
    practicePublicKey.publicKeyPem,
    practicePublicKey.teamId,
    practicePublicKey.keyVersion
  );

  return {
    payload: {
      _sealed: true,
      bookingUid: dto.bookingUid,
      teamId: dto.teamId,
      payloadVersion: PVS_OUTBOX_PAYLOAD_VERSION,
    },
    encryptedPayload,
    payloadVersion: PVS_OUTBOX_PAYLOAD_VERSION,
  };
}
