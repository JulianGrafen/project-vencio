import type { AppointmentSyncDTO, PvsAppointmentRef } from "../types/appointment-sync.dto";
import { resolvePvsAppointmentRef } from "../validate-outbox-job";
import type { DampsoftPvsConfig } from "./dampsoft-pvs.config";
import { resolveDampsoftPvsConfigFromEnv } from "./dampsoft-pvs.config";
import type { PvsAdapter, PvsHealthStatus } from "./pvs-adapter.interface";

type HttpMethod = "GET" | "POST" | "DELETE";

async function callDampsoftApi(
  config: DampsoftPvsConfig,
  path: string,
  method: HttpMethod,
  body?: unknown
): Promise<Response> {
  const baseUrl = config.apiBaseUrl?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("Dampsoft API base URL is not configured");
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  return fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Dampsoft PVS adapter — uses HTTP bridge when DAMPSOFT_PVS_API_URL is set, otherwise stub mode.
 */
export class DampsoftPvsAdapter implements PvsAdapter {
  readonly provider = "dampsoft";
  private readonly config: DampsoftPvsConfig;

  constructor(config?: DampsoftPvsConfig) {
    this.config = config ?? resolveDampsoftPvsConfigFromEnv();
  }

  async healthCheck(): Promise<PvsHealthStatus> {
    if (this.config.simulateFailure) {
      return { ok: false, provider: this.provider, message: "Dampsoft unreachable (stub)" };
    }

    if (!this.config.apiBaseUrl) {
      return { ok: true, provider: this.provider, message: "Dampsoft stub ready" };
    }

    try {
      const response = await callDampsoftApi(this.config, "/health", "GET");
      if (!response.ok) {
        return { ok: false, provider: this.provider, message: `Dampsoft health HTTP ${response.status}` };
      }
      return { ok: true, provider: this.provider, message: "Dampsoft HTTP bridge reachable" };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, provider: this.provider, message };
    }
  }

  async createAppointment(dto: AppointmentSyncDTO): Promise<PvsAppointmentRef> {
    if (this.config.simulateFailure) {
      throw new Error("Dampsoft createAppointment failed (stub)");
    }

    if (this.config.apiBaseUrl) {
      const response = await callDampsoftApi(this.config, "/appointments", "POST", dto);
      if (!response.ok) {
        throw new Error(`Dampsoft createAppointment HTTP ${response.status}`);
      }
      const json = (await response.json()) as { externalId?: string };
      if (!json.externalId?.trim()) {
        throw new Error("Dampsoft createAppointment response missing externalId");
      }
      return { externalId: json.externalId, provider: this.provider };
    }

    return {
      externalId: `ds-${dto.bookingUid.slice(0, 12)}`,
      provider: this.provider,
    };
  }

  async cancelAppointment(ref: PvsAppointmentRef, reason?: string): Promise<void> {
    if (this.config.simulateFailure) {
      throw new Error("Dampsoft cancelAppointment failed (stub)");
    }

    if (this.config.apiBaseUrl) {
      const response = await callDampsoftApi(
        this.config,
        `/appointments/${encodeURIComponent(ref.externalId)}`,
        "DELETE",
        {
          reason,
        }
      );
      if (!response.ok) {
        throw new Error(`Dampsoft cancelAppointment HTTP ${response.status}`);
      }
      return;
    }
  }

  resolveAppointmentRef(payload: AppointmentSyncDTO): PvsAppointmentRef {
    return resolvePvsAppointmentRef(payload, this.provider);
  }
}
