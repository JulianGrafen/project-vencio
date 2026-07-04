export type DeploymentReadinessCheck = {
  id: string;
  ok: boolean;
  message: string;
};

export type DeploymentReadiness = {
  ready: boolean;
  checks: DeploymentReadinessCheck[];
};

function check(id: string, ok: boolean, message: string): DeploymentReadinessCheck {
  return { id, ok, message };
}

/** Minimum config required before Prisma / NextAuth can serve the app. */
export function validateDeploymentReadiness(): DeploymentReadiness {
  const checks: DeploymentReadinessCheck[] = [
    check(
      "database-url",
      Boolean(process.env.DATABASE_URL?.trim()),
      "DATABASE_URL is required (e.g. Neon, Supabase, or Vercel Postgres)"
    ),
    check(
      "nextauth-secret",
      Boolean(process.env.NEXTAUTH_SECRET?.trim()),
      "NEXTAUTH_SECRET is required (openssl rand -base64 32)"
    ),
    check(
      "encryption-key",
      Boolean(process.env.CALENDSO_ENCRYPTION_KEY?.trim()),
      "CALENDSO_ENCRYPTION_KEY is required (openssl rand -base64 24)"
    ),
    check(
      "webapp-url",
      Boolean(process.env.NEXT_PUBLIC_WEBAPP_URL?.trim()),
      "NEXT_PUBLIC_WEBAPP_URL is required (your Vercel domain)"
    ),
  ];

  return {
    ready: checks.every((item) => item.ok),
    checks,
  };
}

export function isDeploymentReady(): boolean {
  return validateDeploymentReadiness().ready;
}
