import { User, isUser } from "./User";
import { SubmissionStatus } from "./SubmissionStatus";
import { isSubmissionStatus } from "./SubmissionStatus";

export interface SubmissionEntry {
  submissionId: number;
  creator: User | null;
  createdAt?: string;
  status?: SubmissionStatus;
  isCommit: boolean;
}

export const isSubmissionEntry = (
  suspect: unknown,
): suspect is SubmissionEntry => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    "submissionId" in suspect &&
    typeof suspect.submissionId === "number" &&
    "isCommit" in suspect &&
    typeof suspect.isCommit === "boolean" &&
    "creator" in suspect &&
    (isUser(suspect.creator) || suspect.creator === null) &&
    (() => {
      if ("createdAt" in suspect) {
        return typeof suspect.createdAt === "string";
      }
      return true;
    })() &&
    (() => {
      if ("status" in suspect) {
        return isSubmissionStatus(suspect.status);
      }
      return true;
    })()
  );
};

export const isSubmissionEntryArray = (
  suspect: unknown,
): suspect is SubmissionEntry[] => {
  return (
    Array.isArray(suspect) && suspect.every((item) => isSubmissionEntry(item))
  );
};
