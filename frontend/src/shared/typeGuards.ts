import { Problem, ProblemEntry, TestCase, User } from "./interfaces";

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
  suspect: object,
): suspect is ProblemEntry[] => {
  return (
    Array.isArray(suspect) && suspect.every((item) => isProblemEntry(item))
  );
};

export const isTestCase = (suspect: object): suspect is TestCase => {
  return (
    "input" in suspect &&
    typeof suspect.input === "string" &&
    "expected" in suspect &&
    typeof suspect.expected === "string"
  );
};

export const isProblem = (suspect: object): suspect is Problem => {
  return (
    "problemId" in suspect &&
    typeof suspect.problemId === "number" &&
    "name" in suspect &&
    typeof suspect.name === "string" &&
    "description" in suspect &&
    typeof suspect.description === "string" &&
    "prompt" in suspect &&
    typeof suspect.prompt === "string" &&
    "languageId" in suspect &&
    typeof suspect.languageId === "number" &&
    "baseCode" in suspect &&
    typeof suspect.baseCode === "string" &&
    "creatorId" in suspect &&
    typeof suspect.creatorId === "number" &&
    "tests" in suspect &&
    Array.isArray(suspect.tests) &&
    suspect.tests.every((item) => isTestCase(item))
  );
};
