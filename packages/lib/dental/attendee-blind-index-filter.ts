import { createEmailBlindIndex } from "../encryption/blind-index";
import { PracticeKeyResolver } from "../encryption/key-resolver";
import { isDentalEncryptionEnabled } from "./feature-flags";

export async function resolveAttendeeEmailBlindIndexes(
  keyResolver: PracticeKeyResolver,
  teamIds: number[],
  email: string
): Promise<string[]> {
  const indexes = await Promise.all(
    teamIds.map(async (teamId) => {
      const { dek } = await keyResolver.resolve(teamId);
      return createEmailBlindIndex(email, dek);
    })
  );

  return Array.from(new Set(indexes));
}

export function shouldUseAttendeeEmailBlindIndexFilter(attendeeEmail: unknown): attendeeEmail is string {
  return isDentalEncryptionEnabled() && typeof attendeeEmail === "string" && attendeeEmail.trim().length > 0;
}
