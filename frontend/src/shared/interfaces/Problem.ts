import { LanguageId } from "../enums";
import { TestCase } from "./TestCase";

export interface Problem {
  problemId: number;
  creatorId: number;
  name: string;
  languageId: LanguageId;
  prompt: string;
  baseCode: string;
  tests: TestCase[];
  isContestsOnly?: boolean;
}

export interface ProblemFilter {
  name?: string;
  language?: LanguageId;
  creator?: string;
  isOwner?: boolean;
}

export interface NewProblem extends Omit<Problem, "problemId" | "creatorId"> {
  isContestsOnly: boolean;
}
