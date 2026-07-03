import type { KeyManagementService } from "../types";
import {
  assertValidMasterKey,
  decryptAes256Gcm,
  encryptAes256Gcm,
  generateDek,
  packGcmPayload,
} from "../crypto-gcm";

const WRAP_PREFIX = "kms-local:v1:";

/**
 * Local envelope KMS for self-hosted EU deployments (Hetzner/Vault-compatible pattern).
 * The master key lives ONLY in the runtime environment — never in PostgreSQL.
 *
 * Production: replace with AWS KMS / HashiCorp Vault implementation using the same interface.
 */
export class LocalEnvelopeKeyManagementService implements KeyManagementService {
  private readonly masterKey: Buffer;

  constructor(masterKeyEnvVar = "DENTAL_KMS_MASTER_KEY") {
    const rawKey = process.env[masterKeyEnvVar];
    if (!rawKey) {
      throw new Error(`${masterKeyEnvVar} is required for dental field encryption`);
    }
    this.masterKey = assertValidMasterKey(rawKey);
  }

  getProviderKeyId(teamId: number): string {
    return `local-envelope:team-${teamId}`;
  }

  async wrapDek(dek: Buffer, teamId: number): Promise<string> {
    const { iv, ciphertext, authTag } = encryptAes256Gcm(
      JSON.stringify({ dek: dek.toString("base64url"), teamId }),
      this.masterKey
    );
    const packed = packGcmPayload(iv, ciphertext, authTag);
    return `${WRAP_PREFIX}${teamId}:${packed.toString("base64url")}`;
  }

  async unwrapDek(encryptedDek: string, teamId: number): Promise<Buffer> {
    if (!encryptedDek.startsWith(WRAP_PREFIX)) {
      throw new Error("Unsupported encrypted DEK format");
    }

    const payload = encryptedDek.slice(WRAP_PREFIX.length);
    const separatorIndex = payload.indexOf(":");
    if (separatorIndex === -1) {
      throw new Error("Malformed encrypted DEK");
    }

    const embeddedTeamId = Number(payload.slice(0, separatorIndex));
    if (embeddedTeamId !== teamId) {
      throw new Error("DEK tenant binding mismatch — access denied");
    }

    const packed = Buffer.from(payload.slice(separatorIndex + 1), "base64url");
    const json = decryptAes256Gcm(packed, this.masterKey);
    const parsed = JSON.parse(json) as { dek: string; teamId: number };

    if (parsed.teamId !== teamId) {
      throw new Error("DEK tenant binding mismatch in payload — access denied");
    }

    return Buffer.from(parsed.dek, "base64url");
  }
}

export async function generateAndWrapPracticeDek(
  kms: KeyManagementService,
  teamId: number
): Promise<{ encryptedDek: string; keyVersion: number }> {
  const dek = generateDek();
  const encryptedDek = await kms.wrapDek(dek, teamId);
  return { encryptedDek, keyVersion: 1 };
}
