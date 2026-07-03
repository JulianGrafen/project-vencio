/** Backward-compatible barrel — prefer importing from focused submodules. */
export { generateDek } from "./crypto-gcm";
export { encryptModelWriteData, decryptModelReadResult } from "./model-crypto";
export { encryptNestedWrites } from "./nested-writes";
export { resolveTeamIdFromWriteData } from "./team-id-resolver";
