import dotEnv from "dotenv";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";

import { isPrismaAvailableCheck } from "./is-prisma-available-check";

dotEnv.config({ path: "../../.env" });

const exec = promisify(execCb);

function isUnreachableDatabaseError(output: string): boolean {
  return output.includes("P1001") || output.includes("Can't reach database server");
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
  if (!(await isPrismaAvailableCheck())) {
    console.info("Prisma can't be initialized, skipping migrations");
    return;
  }

  // Supabase direct host (db.*.supabase.co) is often unreachable from Vercel build
  // runners (IPv6 / network). Prefer Session pooler :5432 for DATABASE_DIRECT_URL.
  const deployEnv = {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_DIRECT_URL,
  };

  const { stdout, stderr } = await exec("yarn prisma migrate deploy", {
    env: deployEnv,
    maxBuffer: 10 * 1024 * 1024,
  });

  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
}

main().catch((e: NodeJS.ErrnoException & { stdout?: string; stderr?: string }) => {
  const output = [e.stdout, e.stderr, e.message].filter(Boolean).join("\n");

  if (process.env.VERCEL === "1" && isUnreachableDatabaseError(output)) {
    console.warn("Skipping migrations on Vercel build: database unreachable (P1001).");
    console.warn(
      "Apply schema first: run GitHub Action 'Supabase Migrate', or paste scripts/supabase/002_medical_recall_patch.sql in Supabase SQL Editor."
    );
    console.warn(
      "Long-term fix: set DATABASE_DIRECT_URL to the Supabase Session pooler (port 5432 on *.pooler.supabase.com), not db.*.supabase.co."
    );
    return;
  }

  console.error("Prisma migrate deploy failed:");
  if (e.stdout) console.error(e.stdout);
  if (e.stderr) console.error(e.stderr);
  console.error(e.message ?? e);
  process.exit(1);
});
