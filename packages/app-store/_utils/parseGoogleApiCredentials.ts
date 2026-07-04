import type { Prisma } from "@calcom/prisma/client";

type GoogleAppKeys = {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
};

export function parseGoogleApiCredentialsFromEnv(
  raw = process.env.GOOGLE_API_CREDENTIALS
): GoogleAppKeys | null {
  if (!raw?.trim()) {
    return null;
  }

  try {
    const { client_secret, client_id, redirect_uris } = JSON.parse(raw).web;
    if (!client_id || !client_secret) {
      return null;
    }

    return {
      client_id,
      client_secret,
      redirect_uris: redirect_uris ?? [],
    };
  } catch {
    return null;
  }
}

export function getOffice365AppKeysFromEnv(): Prisma.JsonObject | null {
  const client_id = process.env.MS_GRAPH_CLIENT_ID?.trim();
  const client_secret = process.env.MS_GRAPH_CLIENT_SECRET?.trim();

  if (!client_id || !client_secret) {
    return null;
  }

  return { client_id, client_secret };
}
