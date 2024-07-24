import { Result } from "./Result";

export interface Submission {
  languageId: number;
  code: string;
  result: Result;
}
