import { TestCaseResult } from "./TestCaseResult";

export interface Result {
  tests: TestCaseResult[];
  averageMemory: number;
  averageTime: number;
}
