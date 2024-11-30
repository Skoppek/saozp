import { LanguageId } from "../enums";

export interface Language {
  id: LanguageId;
  name: string;
  monacoForm: string;
}
