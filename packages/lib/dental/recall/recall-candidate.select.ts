/** Shared Prisma select for recall-eligible Smart-Fill patients. */
export const RECALL_CANDIDATE_PATIENT_SELECT = {
  id: true,
  teamId: true,
  name: true,
  email: true,
  phoneNumber: true,
  lastVisitAt: true,
} as const;

export type RecallCandidatePatientRow = {
  id: string;
  teamId: number;
  name: string;
  email: string;
  phoneNumber: string;
  lastVisitAt: Date | null;
};
