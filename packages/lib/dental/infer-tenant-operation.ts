/** Infers encrypt vs decrypt operation from a tRPC procedure path. */
export function inferTenantOperationFromPath(path: string): "encrypt" | "decrypt" {
  const isWrite = path.includes("create") || path.includes("update") || path.includes("confirm");
  return isWrite ? "encrypt" : "decrypt";
}
