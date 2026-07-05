import { randomBytes } from "node:crypto";

/**
 * Ensures minimum env vars exist at runtime on Vercel.
 * Build-time placeholders in next.config.ts do not carry over to serverless functions.
 */
export function bootstrapRuntimeEnv(): void {
  const env = process.env as Record<string, string | undefined>;

  if (process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_WEBAPP_URL) {
    env.NEXT_PUBLIC_WEBAPP_URL = `https://${process.env.VERCEL_URL}`;
  }

  if (!process.env.NEXTAUTH_URL && process.env.NEXT_PUBLIC_WEBAPP_URL) {
    env.NEXTAUTH_URL = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/auth`;
  }

  if (!process.env.NEXT_PUBLIC_WEBSITE_URL && process.env.NEXT_PUBLIC_WEBAPP_URL) {
    env.NEXT_PUBLIC_WEBSITE_URL = process.env.NEXT_PUBLIC_WEBAPP_URL;
  }

  ensureRuntimeSecret(env, "NEXTAUTH_SECRET");
  ensureRuntimeSecret(env, "CALENDSO_ENCRYPTION_KEY", 24);

  if (process.env.DENTAL_ENCRYPTION_ENABLED === "true") {
    ensureRuntimeSecret(env, "DENTAL_KMS_MASTER_KEY");
  }
}

function ensureRuntimeSecret(
  env: Record<string, string | undefined>,
  name: string,
  byteLength = 32
): void {
  if (process.env[name]) {
    return;
  }

  if (!process.env.VERCEL) {
    return;
  }

  env[name] = randomBytes(byteLength).toString("base64");
  console.warn(
    `⚠️  ${name} is not set. Using an ephemeral runtime placeholder on Vercel. ` +
      "Set it in Project Settings → Environment Variables before production use."
  );
}
