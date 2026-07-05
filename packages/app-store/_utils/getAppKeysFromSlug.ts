import prisma from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";

import { getOffice365AppKeysFromEnv, parseGoogleApiCredentialsFromEnv } from "./parseGoogleApiCredentials";

function getEnvFallbackAppKeys(slug: string): Prisma.JsonObject | null {
  if (slug === "google-calendar" || slug === "google-meet") {
    return parseGoogleApiCredentialsFromEnv();
  }

  if (slug === "office365-calendar" || slug === "msteams") {
    return getOffice365AppKeysFromEnv();
  }

  return null;
}

async function getAppKeysFromSlug(slug: string) {
  const app = await prisma.app.findUnique({ where: { slug } });
  const dbKeys = (app?.keys || {}) as Prisma.JsonObject;

  if (Object.keys(dbKeys).length > 0) {
    return dbKeys;
  }

  return getEnvFallbackAppKeys(slug) ?? dbKeys;
}

export default getAppKeysFromSlug;
