import { LanguageId } from "./enums";

export interface ClassName {
  className?: string | undefined;
}

export interface TestCase {
  input: string;
  expected: string;
}

export interface Language {
  id: LanguageId;
  name: string;
  monacoForm: string;
}

export interface Problem {
  problemId: number;
  creatorId: number;
  name: string;
  description?: string;
  languageId: LanguageId;
  prompt: string;
  baseCode: string;
  tests: TestCase[];
}

export type ProblemEntry = Pick<
  Problem,
  "problemId" | "name" | "description" | "languageId"
>;

export type NewProblem = Omit<Problem, "problemId" | "creatorId">;
