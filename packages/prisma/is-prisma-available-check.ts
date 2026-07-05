import { Prisma } from "./client";

function isDatabaseConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("P1001") ||
    message.includes("Can't reach database") ||
    message.includes("ECONNREFUSED") ||
    message.includes("ETIMEDOUT")
  );
}

export async function isPrismaAvailableCheck(): Promise<boolean> {
  try {
    const { prisma } = await import("./index");

    await prisma.$queryRaw<unknown[]>(Prisma.sql`SELECT 1`);
    await prisma.$disconnect();
    return true;
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientInitializationError || isDatabaseConnectionError(e)) {
      return false;
    }
    throw e;
  }
}
