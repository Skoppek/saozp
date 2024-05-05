import {
  Problem,
  ProblemEntry,
  SubmissionEntry,
  SubmissionStatus,
  TestCase,
  User,
} from "./interfaces";

export const isUser = (suspect: unknown): suspect is User => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    "userId" in suspect &&
    typeof suspect.userId === "number" &&
    "firstName" in suspect &&
    typeof suspect.firstName === "string" &&
    "lastName" in suspect &&
    typeof suspect.lastName === "string"
  );
};

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
    typeof suspect.description === "string"
  );
};

export const isProblemsEntryArray = (
  suspect: unknown,
): suspect is ProblemEntry[] => {
  return (
    Array.isArray(suspect) && suspect.every((item) => isProblemEntry(item))
  );
};

export const isTestCase = (suspect: unknown): suspect is TestCase => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    "input" in suspect &&
    typeof suspect.input === "string" &&
    "expected" in suspect &&
    typeof suspect.expected === "string"
  );
};

export const isProblem = (suspect: unknown): suspect is Problem => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
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

export const isSubmissionStatus = (
  suspect: unknown,
): suspect is SubmissionStatus => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    "id" in suspect &&
    typeof suspect.id === "number" &&
    "description" in suspect &&
    typeof suspect.description === "string"
  );
};

export const isSubmissionEntry = (
  suspect: unknown,
): suspect is SubmissionEntry => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    "submissionId" in suspect &&
    typeof suspect.submissionId === "number" &&
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
