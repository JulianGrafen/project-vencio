import { createHash } from "node:crypto";

export function computePublicKeyFingerprint(publicKeyPem: string): string {
  return createHash("sha256").update(publicKeyPem.trim()).digest("hex").slice(0, 32);
}
