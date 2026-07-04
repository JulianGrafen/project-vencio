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

function isPostgresUrl(value: string | undefined): boolean {
  return Boolean(value?.trim().startsWith("postgresql://") || value?.trim().startsWith("postgres://"));
}

/** Minimum config required before Prisma / NextAuth can serve the app. */
export function validateDeploymentReadiness(): DeploymentReadiness {
  const checks: DeploymentReadinessCheck[] = [];

  const databaseUrl = process.env.DATABASE_URL?.trim();
  const databaseDirectUrl = process.env.DATABASE_DIRECT_URL?.trim();
  const supabasePublicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!databaseUrl && supabasePublicUrl) {
    checks.push(
      check(
        "supabase-url-misnamed",
        false,
        "NEXT_PUBLIC_SUPABASE_URL is the Supabase API URL (https://….supabase.co), not the Postgres connection. " +
          "In Vercel, create DATABASE_URL with the PostgreSQL URI from Supabase → Settings → Database → Connection string (Transaction pooler, port 6543)."
      )
    );
  }

  if (databaseUrl && !isPostgresUrl(databaseUrl)) {
    checks.push(
      check(
        "database-url-format",
        false,
        "DATABASE_URL must be a PostgreSQL URI (postgresql://…), not an https:// Supabase project URL."
      )
    );
  }

  checks.push(
    check(
      "database-url",
      isPostgresUrl(databaseUrl),
      "DATABASE_URL is required — PostgreSQL URI from Supabase (Transaction pooler, port 6543, ?pgbouncer=true)"
    ),
    check(
      "database-direct-url",
      isPostgresUrl(databaseDirectUrl),
      "DATABASE_DIRECT_URL is required — PostgreSQL URI from Supabase (Session/Direct, port 5432) for migrations"
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
      "NEXT_PUBLIC_WEBAPP_URL is required (your Vercel domain, e.g. https://your-app.vercel.app)"
    )
  );

  return {
    ready: checks.every((item) => item.ok),
    checks,
  };
}

export function isDeploymentReady(): boolean {
  return validateDeploymentReadiness().ready;
}
