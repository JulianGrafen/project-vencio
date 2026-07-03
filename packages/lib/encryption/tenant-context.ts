import { AsyncLocalStorage } from "node:async_hooks";

import type { TenantCryptoContext } from "./types";

export const tenantContextStorage = new AsyncLocalStorage<TenantCryptoContext>();

export function getTenantCryptoContext(): TenantCryptoContext | undefined {
  return tenantContextStorage.getStore();
}

export function runWithTenantContext<T>(context: TenantCryptoContext, fn: () => T): T {
  return tenantContextStorage.run(context, fn);
}

export async function runWithTenantContextAsync<T>(
  context: TenantCryptoContext,
  fn: () => Promise<T>
): Promise<T> {
  return tenantContextStorage.run(context, fn);
}
