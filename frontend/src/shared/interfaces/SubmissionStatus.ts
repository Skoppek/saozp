import { TestStatus } from "../enums";

export interface SubmissionStatus {
  id: TestStatus;
  description: string;
}

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
