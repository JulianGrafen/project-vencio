import dotEnv from "dotenv";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";

import { isPrismaAvailableCheck } from "./is-prisma-available-check";

dotEnv.config({ path: "../../.env" });

const exec = promisify(execCb);

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
  const deployEnv = {
    ...process.env,
    // Migrations must use the direct connection — never the transaction pooler.
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
  console.error("Prisma migrate deploy failed:");
  if (e.stdout) console.error(e.stdout);
  if (e.stderr) console.error(e.stderr);
  console.error(e.message ?? e);
  process.exit(1);
});
