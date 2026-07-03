/**
 * Extracts minutes-from-midnight from Prisma @db.Time values (UTC-safe).
 */
export function timeToMinutesUtc(time: Date): number {
  return time.getUTCHours() * 60 + time.getUTCMinutes();
}
