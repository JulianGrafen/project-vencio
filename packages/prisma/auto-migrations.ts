import dotEnv from "dotenv";
import { exec as execCb, type ExecException } from "node:child_process";
import { promisify } from "node:util";

import { isPrismaAvailableCheck } from "./is-prisma-available-check";

dotEnv.config({ path: "../../.env" });

const exec = promisify(execCb);

function commandOutput(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return String(error);
  }
  const execError = error as ExecException & { stdout?: string; stderr?: string };
  return [execError.stdout, execError.stderr, execError.message].filter(Boolean).join("\n");
}

function isSchemaUpToDate(output: string): boolean {
  return output.includes("Database schema is up to date");
}

function hasPendingMigrations(output: string): boolean {
  return output.includes("have not yet been applied");
}

function isDatabaseUnreachable(output: string): boolean {
  return (
    output.includes("P1001") ||
    output.includes("Can't reach database server") ||
    output.includes("ECONNREFUSED") ||
    output.includes("ETIMEDOUT")
  );
}

function printVercelMigrationHelp(): void {
  console.warn(
    [
      "",
      "Vercel build: could not run database migrations (direct connection unreachable).",
      "Skipping migrations so the build can continue — runtime uses DATABASE_URL (pooler).",
      "",
      "If you created tables via Supabase SQL Editor, also set SKIP_DB_MIGRATIONS=1 to silence this.",
      "",
      "To enable build-time migrations, fix DATABASE_DIRECT_URL:",
      "- User must be postgres (not postgres.<project-ref>) on port 5432",
      "- Password URL-encoded if it contains special characters",
      "- Append ?sslmode=require if missing",
      "- Supabase → Database → Network: allow connections from anywhere",
      "",
    ].join("\n")
  );
}

function shouldSkipUnreachableMigrationsOnVercel(output: string): boolean {
  return process.env.VERCEL === "1" && isDatabaseUnreachable(output);
}

async function runPrismaCommand(command: string): Promise<{ stdout: string; stderr: string }> {
  const { stdout, stderr } = await exec(command, {
    env: {
      ...process.env,
    },
  });
  return { stdout, stderr };
}

/**
 * TODO: re-write this when Prisma.io gets a programmatic migration API
 * Thanks to @olalonde for the idea.
 * @see https://github.com/prisma/prisma/issues/4703#issuecomment-1447354363
 */
async function main(): Promise<void> {
  if (process.env.SKIP_DB_MIGRATIONS === "1") {
    console.info("SKIP_DB_MIGRATIONS set, skipping migrations");
    return;
  }
  if (!process.env.DATABASE_URL) {
    console.info("No DATABASE_URL found, skipping migrations");
    return;
  }
  if (!process.env.DATABASE_DIRECT_URL) {
    console.info("No DATABASE_DIRECT_URL found, skipping migrations");
    return;
  }
  let prismaAvailable = false;
  try {
    prismaAvailable = await isPrismaAvailableCheck();
  } catch (error) {
    console.error(commandOutput(error));
    if (process.env.VERCEL === "1") {
      printVercelMigrationHelp();
      return;
    }
    throw error;
  }

  if (!prismaAvailable) {
    console.info("Prisma can't be initialized, skipping migrations");
    return;
  }

  let statusOutput = "";
  try {
    const { stdout, stderr } = await runPrismaCommand("yarn prisma migrate status");
    statusOutput = `${stdout}\n${stderr}`;
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
  } catch (error) {
    statusOutput = commandOutput(error);
    console.error(statusOutput);
  }

  if (isSchemaUpToDate(statusOutput)) {
    console.info("Database schema is up to date, skipping migrate deploy");
    return;
  }

  if (isDatabaseUnreachable(statusOutput) && !hasPendingMigrations(statusOutput)) {
    if (shouldSkipUnreachableMigrationsOnVercel(statusOutput)) {
      printVercelMigrationHelp();
      return;
    }
    throw new Error("Cannot reach database for prisma migrate status");
  }

  try {
    const { stdout, stderr } = await runPrismaCommand("yarn prisma migrate deploy");
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
  } catch (error) {
    const deployOutput = commandOutput(error);
    console.error(deployOutput);

    if (isSchemaUpToDate(deployOutput)) {
      console.info("Database schema is up to date");
      return;
    }

    if (shouldSkipUnreachableMigrationsOnVercel(deployOutput)) {
      printVercelMigrationHelp();
      return;
    }

    throw error;
  }
}

main().catch((error) => {
  console.error(commandOutput(error));
  process.exit(1);
});
