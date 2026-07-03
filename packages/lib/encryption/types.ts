export type DataClassification = "P0_HEALTH" | "P1_PII" | "P2_INDIRECT";

export interface FieldEncryptionConfig {
  classification: DataClassification;
  /** Encrypt the entire JSON blob as one string. */
  json?: boolean;
  /** Store HMAC blind index alongside the encrypted value (enables lookup without plaintext). */
  blindIndex?: boolean;
  /** Companion column for blind index (defaults to `{field}BlindIndex`). */
  blindIndexField?: string;
}

export type ModelFieldRegistry = Record<string, FieldEncryptionConfig>;

export interface EncryptedFieldPayload {
  v: 1;
  alg: "AES-256-GCM";
  teamId: number;
  keyVersion: number;
  ct: string;
}

export interface TenantCryptoContext {
  teamId: number;
  operation: "encrypt" | "decrypt";
  actorUserId?: number;
}

export interface PracticeKeyMaterial {
  teamId: number;
  keyVersion: number;
  dek: Buffer;
}

export interface KeyManagementService {
  wrapDek(dek: Buffer, teamId: number): Promise<string>;
  unwrapDek(encryptedDek: string, teamId: number): Promise<Buffer>;
  getProviderKeyId(teamId: number): string | null;
}
