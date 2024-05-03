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
  description: string;
  languageId: LanguageId;
  prompt: string;
  baseCode: string;
  tests: TestCase[];
}

export interface ProblemEntry
  extends Pick<Problem, "problemId" | "name" | "description" | "languageId"> {
  creator: User;
}

export type NewProblem = Omit<Problem, "problemId" | "creatorId">;

export interface ProblemsFilter {
  name?: string;
  language?: LanguageId;
  creator?: string;
  isOwner?: boolean;
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
}
