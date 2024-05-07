import {
  Problem,
  ProblemEntry,
  Submission,
  SubmissionEntry,
  SubmissionStatus,
  TestCase,
  TestCaseResult,
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

export const isTestCaseResult = (
  suspect: unknown,
): suspect is TestCaseResult => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    "input" in suspect &&
    typeof suspect.input === "string" &&
    "expected" in suspect &&
    typeof suspect.expected === "string" &&
    "received" in suspect &&
    (typeof suspect.received === "string" || suspect.received == null) &&
    "token" in suspect &&
    typeof suspect.token === "string" &&
    "statusId" in suspect &&
    typeof suspect.statusId === "number"
  );
};

export const isTestCaseResultArray = (
  suspect: unknown,
): suspect is TestCaseResult[] => {
  return (
    Array.isArray(suspect) && suspect.every((item) => isTestCaseResult(item))
  );
};

export const isResult = (suspect: unknown): suspect is TestCaseResult => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    "tests" in suspect &&
    isTestCaseResultArray(suspect.tests) &&
    "averageMemory" in suspect &&
    typeof suspect.averageMemory === "number" &&
    "averageTime" in suspect &&
    typeof suspect.averageTime === "number"
  );
};

export const isSubmission = (suspect: unknown): suspect is Submission => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    "languageId" in suspect &&
    typeof suspect.languageId === "number" &&
    "code" in suspect &&
    typeof suspect.code === "string" &&
    "result" in suspect &&
    isResult(suspect.result)
  );
};
