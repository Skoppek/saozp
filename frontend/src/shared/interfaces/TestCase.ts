export interface TestCase {
  input: string;
  expected: string;
}

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
