import { Result, isResult } from "./Result";

export interface Submission {
  languageId: number;
  code: string;
  result: Result;
}

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
