import type { PracticeKeyMaterial } from "./types";

export interface PracticeEncryptionKeyRecord {
  encryptedDek: string;
  keyVersion: number;
  isActive: boolean;
}

export interface PracticeKeyStore {
  practiceEncryptionKey: {
    findUnique(args: { where: { teamId: number } }): Promise<PracticeEncryptionKeyRecord | null>;
    upsert(args: {
      where: { teamId: number };
      create: {
        teamId: number;
        encryptedDek: string;
        keyVersion: number;
        kmsKeyId: string | null;
        algorithm: string;
      };
      update: {
        encryptedDek: string;
        keyVersion: number;
        kmsKeyId: string | null;
        isActive: boolean;
        rotatedAt: Date;
      };
    }): Promise<PracticeEncryptionKeyRecord>;
  };
}

export type { PracticeKeyMaterial };

export interface TeamLookupStore {
  eventType: {
    findUnique(args: {
      where: { id: number };
      select: { teamId: true };
    }): Promise<{ teamId: number | null } | null>;
  };
  booking: {
    findUnique(args: {
      where: { id: number };
      select: { eventType: { select: { teamId: true } } };
    }): Promise<{ eventType: { teamId: number | null } | null } | null>;
  };
}
