import { TestCase } from "./TestCase";

export interface TestCaseResult extends TestCase {
  received: string;
  token: string;
  statusId: number;
}

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
