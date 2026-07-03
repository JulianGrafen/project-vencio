import type { PracticeKeyStore } from "./prisma-types";
import { generateDek } from "./crypto-gcm";
import { createKeyManagementService } from "./kms";
import type { KeyManagementService, PracticeKeyMaterial } from "./types";
import type { PracticeKeyStore } from "./prisma-types";

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CachedDek {
  material: PracticeKeyMaterial;
  expiresAt: number;
}

export class PracticeKeyResolver {
  private readonly cache = new Map<number, CachedDek>();
  private readonly kms: KeyManagementService;

  constructor(
    private readonly prisma: PracticeKeyStore,
    kms?: KeyManagementService
  ) {
    this.kms = kms ?? createKeyManagementService();
  }

  async resolve(teamId: number): Promise<PracticeKeyMaterial> {
    const cached = this.cache.get(teamId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.material;
    }

    let keyRecord = await this.prisma.practiceEncryptionKey.findUnique({
      where: { teamId },
    });

    if (!keyRecord || !keyRecord.isActive) {
      const { encryptedDek, keyVersion } = await this.provisionNewKey(teamId);
      keyRecord = await this.prisma.practiceEncryptionKey.upsert({
        where: { teamId },
        create: {
          teamId,
          encryptedDek,
          keyVersion,
          kmsKeyId: this.kms.getProviderKeyId(teamId),
          algorithm: "AES-256-GCM",
        },
        update: {
          encryptedDek,
          keyVersion,
          kmsKeyId: this.kms.getProviderKeyId(teamId),
          isActive: true,
          rotatedAt: new Date(),
        },
      });
    }

    const dek = await this.kms.unwrapDek(keyRecord.encryptedDek, teamId);
    const material: PracticeKeyMaterial = {
      teamId,
      keyVersion: keyRecord.keyVersion,
      dek,
    };

    this.cache.set(teamId, {
      material,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return material;
  }

  private async provisionNewKey(teamId: number) {
    const dek = generateDek();
    const encryptedDek = await this.kms.wrapDek(dek, teamId);
    return { encryptedDek, keyVersion: 1 };
  }

  invalidate(teamId: number): void {
    this.cache.delete(teamId);
  }
}
