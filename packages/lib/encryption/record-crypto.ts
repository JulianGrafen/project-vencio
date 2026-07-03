/** Backward-compatible barrel — prefer importing from focused submodules. */
/** @deprecated Import from `./model-crypto`, `./nested-writes`, or `./team-id-resolver` directly. */
export { generateDek } from "./crypto-gcm";
export { encryptModelWriteData, decryptModelReadResult } from "./model-crypto";
export { encryptNestedWrites } from "./nested-writes";
export { resolveTeamIdFromWriteData } from "./team-id-resolver";
