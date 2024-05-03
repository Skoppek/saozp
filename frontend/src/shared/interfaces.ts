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
