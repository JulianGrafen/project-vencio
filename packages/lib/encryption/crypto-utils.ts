type WritableRecord = Record<string, unknown>;

export function isPlainObject(value: unknown): value is WritableRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function serializeValueForEncryption(value: unknown, json?: boolean): string {
  if (json) {
    return JSON.stringify(value ?? null);
  }
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

export function deserializeValueAfterDecryption(raw: string, json?: boolean): unknown {
  if (!json) {
    return raw;
  }
  return JSON.parse(raw) as unknown;
}

export type { WritableRecord };
