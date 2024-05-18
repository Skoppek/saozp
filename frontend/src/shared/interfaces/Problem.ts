import { LanguageId } from "../enums";
import { TestCase } from "./TestCase";
import { isTestCase } from "./TestCase";

export interface Problem {
  problemId: number;
  creatorId: number;
  name: string;
  description: string;
  languageId: LanguageId;
  prompt: string;
  baseCode: string;
  tests: TestCase[];
  activeAfter: Date;
}

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
    "activeAfter" in suspect &&
    typeof suspect.activeAfter === "string" &&
    "creatorId" in suspect &&
    typeof suspect.creatorId === "number" &&
    "tests" in suspect &&
    Array.isArray(suspect.tests) &&
    suspect.tests.every((item) => isTestCase(item))
  );
};

export interface ProblemFilter {
  name?: string;
  language?: LanguageId;
  creator?: string;
  isOwner?: boolean;
}

export type NewProblem = Omit<Problem, "problemId" | "creatorId">;
