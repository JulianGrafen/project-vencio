import { prisma } from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";
import { AppCategories } from "@calcom/prisma/enums";

import { getOffice365AppKeysFromEnv, parseGoogleApiCredentialsFromEnv } from "./parseGoogleApiCredentials";
import { shouldEnableApp } from "./validateAppKeys";

type AppSeedConfig = {
  slug: string;
  dirName: string;
  categories: AppCategories[];
  type: string;
  keys?: Prisma.JsonObject;
};

async function upsertAppFromEnv({ slug, dirName, categories, type, keys }: AppSeedConfig) {
  const enabled = shouldEnableApp(dirName, keys);
  const data = {
    slug,
    dirName,
    categories,
    ...(keys !== undefined && { keys }),
    enabled,
  };

  const existing = await prisma.app.findFirst({
    where: { OR: [{ slug }, { dirName }] },
    select: { slug: true, dirName: true, keys: true, enabled: true },
  });

  if (!existing) {
    await prisma.app.create({ data });
    return;
  }

  const keysUnchanged =
    keys === undefined || JSON.stringify(existing.keys ?? null) === JSON.stringify(keys ?? null);
  const enabledUnchanged = existing.enabled === enabled;

  if (keysUnchanged && enabledUnchanged) {
    return;
  }

  await prisma.app.update({
    where: { slug: existing.slug },
    data,
  });

  await prisma.credential.updateMany({
    where: { type },
    data: { appId: slug },
  });
}

/** Calendar apps that should be connectable even when DB seed/sync has not run yet. */
export function getCalendarAppSlugsEnabledAtRuntime(): ReadonlySet<string> {
  const slugs = new Set(["apple-calendar", "caldav-calendar"]);

  if (parseGoogleApiCredentialsFromEnv()) {
    slugs.add("google-calendar");
    slugs.add("google-meet");
  }

  if (getOffice365AppKeysFromEnv()) {
    slugs.add("office365-calendar");
    slugs.add("msteams");
  }

  return slugs;
}

/**
 * Ensures calendar integrations are registered in the App table when OAuth
 * credentials are provided via environment variables (e.g. Vercel) without
 * running `yarn seed-app-store` manually.
 */
export async function syncCalendarAppsFromEnv(): Promise<void> {
  const calendarAppsWithoutKeys: AppSeedConfig[] = [
    {
      slug: "apple-calendar",
      dirName: "applecalendar",
      categories: [AppCategories.calendar],
      type: "apple_calendar",
    },
    {
      slug: "caldav-calendar",
      dirName: "caldavcalendar",
      categories: [AppCategories.calendar],
      type: "caldav_calendar",
    },
  ];

  for (const app of calendarAppsWithoutKeys) {
    await upsertAppFromEnv(app);
  }

  const googleKeys = parseGoogleApiCredentialsFromEnv();
  if (googleKeys) {
    await upsertAppFromEnv({
      slug: "google-calendar",
      dirName: "googlecalendar",
      categories: [AppCategories.calendar],
      type: "google_calendar",
      keys: googleKeys,
    });
    await upsertAppFromEnv({
      slug: "google-meet",
      dirName: "googlevideo",
      categories: [AppCategories.conferencing],
      type: "google_video",
      keys: googleKeys,
    });
  }

  const office365Keys = getOffice365AppKeysFromEnv();
  if (office365Keys) {
    await upsertAppFromEnv({
      slug: "office365-calendar",
      dirName: "office365calendar",
      categories: [AppCategories.calendar],
      type: "office365_calendar",
      keys: office365Keys,
    });
    await upsertAppFromEnv({
      slug: "msteams",
      dirName: "office365video",
      categories: [AppCategories.conferencing],
      type: "office365_video",
      keys: office365Keys,
    });
  }
}
