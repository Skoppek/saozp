import { LanguageId } from "../enums";
import c from "./c";
import cpp from "./cpp";
import java from "./java";
import python from "./python";

export const languageToSnippet: Record<LanguageId, string> = {
  [LanguageId.C]: c,
  [LanguageId.CPP]: cpp,
  [LanguageId.JAVA_13]: java,
  [LanguageId.PYTHON_3_8_1]: python,
  [LanguageId.UNKNOWN]: "",
};
