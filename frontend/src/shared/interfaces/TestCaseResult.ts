import { TestCase } from "./TestCase";

export interface TestCaseResult extends TestCase {
  received: string | null;
  error?: string | null;
  token: string;
  statusId: number;
}
