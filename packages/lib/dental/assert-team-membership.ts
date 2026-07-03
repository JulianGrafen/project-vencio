import { MembershipRepository } from "@calcom/features/membership/repositories/MembershipRepository";
import { TRPCError } from "@trpc/server";

export async function assertAcceptedTeamMembership(userId: number, teamId: number): Promise<void> {
  const repository = new MembershipRepository();
  const hasMembership = await repository.hasMembership({ userId, teamId });

  if (!hasMembership) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not a member of this practice." });
  }
}

export async function assertAdminOrOwnerTeamMembership(userId: number, teamId: number): Promise<void> {
  const membership = await MembershipRepository.getAdminOrOwnerMembership(userId, teamId);

  if (!membership) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin or owner role required." });
  }
}
