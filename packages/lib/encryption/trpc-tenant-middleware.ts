import { runWithTenantContextAsync, type TenantCryptoContext } from "./tenant-context";

/**
 * Wraps a tRPC handler with tenant-scoped encryption context.
 * Must be applied to all routes that read/write encrypted patient data.
 */
export function withDentalTenantContext<T>(
  context: TenantCryptoContext,
  handler: () => Promise<T>
): Promise<T> {
  return runWithTenantContextAsync(context, handler);
}
