import { TestCaseResult } from "./TestCaseResult";
import { isTestCaseResultArray } from "./TestCaseResult";

export interface Result {
  tests: TestCaseResult[];
  averageMemory: number;
  averageTime: number;
}

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
