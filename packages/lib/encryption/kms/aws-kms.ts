import {
  DecryptCommand,
  EncryptCommand,
  KMSClient,
  type KMSClientConfig,
} from "@aws-sdk/client-kms";

import type { KeyManagementService } from "../types";

const AWS_WRAP_PREFIX = "kms-aws:v1:";

export interface AwsKmsConfig {
  region?: string;
  keyArn?: string;
  client?: KMSClient;
}

/**
 * AWS KMS envelope encryption for EU deployments (e.g. eu-central-1 Frankfurt).
 * IAM policy must restrict Decrypt to EncryptionContext teamId matching request tenant.
 */
export class AwsKmsKeyManagementService implements KeyManagementService {
  private readonly client: KMSClient;
  private readonly keyArn: string;

  constructor(config: AwsKmsConfig = {}) {
    const region = config.region ?? process.env.AWS_KMS_REGION ?? "eu-central-1";
    const keyArn = config.keyArn ?? process.env.AWS_KMS_KEY_ARN;

    if (!keyArn) {
      throw new Error("AWS_KMS_KEY_ARN is required when DENTAL_KMS_PROVIDER=aws-kms");
    }

    this.keyArn = keyArn;
    this.client =
      config.client ??
      new KMSClient({
        region,
      } satisfies KMSClientConfig);
  }

  getProviderKeyId(teamId: number): string {
    return this.keyArn.replace("{teamId}", String(teamId));
  }

  async wrapDek(dek: Buffer, teamId: number): Promise<string> {
    const response = await this.client.send(
      new EncryptCommand({
        KeyId: this.keyArn,
        Plaintext: dek,
        EncryptionContext: {
          teamId: String(teamId),
          purpose: "dental-practice-dek",
        },
      })
    );

    if (!response.CiphertextBlob) {
      throw new Error("AWS KMS Encrypt returned empty ciphertext");
    }

    return `${AWS_WRAP_PREFIX}${teamId}:${Buffer.from(response.CiphertextBlob).toString("base64url")}`;
  }

  async unwrapDek(encryptedDek: string, teamId: number): Promise<Buffer> {
    if (!encryptedDek.startsWith(AWS_WRAP_PREFIX)) {
      throw new Error("Unsupported AWS KMS encrypted DEK format");
    }

    const payload = encryptedDek.slice(AWS_WRAP_PREFIX.length);
    const separatorIndex = payload.indexOf(":");
    if (separatorIndex === -1) {
      throw new Error("Malformed AWS KMS encrypted DEK");
    }

    const embeddedTeamId = Number(payload.slice(0, separatorIndex));
    if (embeddedTeamId !== teamId) {
      throw new Error("DEK tenant binding mismatch — access denied");
    }

    const ciphertext = Buffer.from(payload.slice(separatorIndex + 1), "base64url");
    const response = await this.client.send(
      new DecryptCommand({
        CiphertextBlob: ciphertext,
        EncryptionContext: {
          teamId: String(teamId),
          purpose: "dental-practice-dek",
        },
      })
    );

    if (!response.Plaintext) {
      throw new Error("AWS KMS Decrypt returned empty plaintext");
    }

    return Buffer.from(response.Plaintext);
  }
}
