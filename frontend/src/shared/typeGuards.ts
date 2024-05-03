import { ProblemEntry, User } from "./interfaces";

export const isUser = (suspect: object): suspect is User => {
  return (
    "userId" in suspect &&
    typeof suspect.userId === "number" &&
    "firstName" in suspect &&
    typeof suspect.firstName === "string" &&
    "lastName" in suspect &&
    typeof suspect.lastName === "string"
  );
};

export const isProblemEntry = (suspect: object): suspect is ProblemEntry => {
  return (
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
    typeof suspect.description === "string"
  );
};

export const isProblemsEntryArray = (
  response: object,
): response is ProblemEntry[] => {
  return (
    Array.isArray(response) && response.every((item) => isProblemEntry(item))
  );
};
