export type DampsoftPvsConfig = {
  apiBaseUrl?: string;
  apiKey?: string;
  simulateFailure?: boolean;
};

export function resolveDampsoftPvsConfigFromEnv(): DampsoftPvsConfig {
  return {
    apiBaseUrl: process.env.DAMPSOFT_PVS_API_URL?.trim() || undefined,
    apiKey: process.env.DAMPSOFT_PVS_API_KEY?.trim() || undefined,
    simulateFailure: process.env.DAMPSOFT_PVS_SIMULATE_FAILURE === "true",
  };
}
