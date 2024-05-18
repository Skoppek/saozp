import { Problem } from "./Problem";
import { User, isUser } from "./User";

export interface ProblemEntry
  extends Pick<
    Problem,
    "problemId" | "name" | "description" | "languageId" | "activeAfter"
  > {
  creator: User;
}

export const isProblemEntry = (suspect: unknown): suspect is ProblemEntry => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    "problemId" in suspect &&
    typeof suspect.problemId === "number" &&
    "name" in suspect &&
    typeof suspect.name === "string" &&
    "languageId" in suspect &&
    typeof suspect.languageId === "number" &&
    "creator" in suspect &&
    typeof suspect.creator === "object" &&
    suspect.creator !== null &&
    isUser(suspect.creator) &&
    "description" in suspect &&
    typeof suspect.description === "string" &&
    "activeAfter" in suspect &&
    typeof suspect.activeAfter === "string"
  );
};

export const isProblemsEntryArray = (
  suspect: unknown,
): suspect is ProblemEntry[] => {
  return (
    Array.isArray(suspect) && suspect.every((item) => isProblemEntry(item))
  );
};
