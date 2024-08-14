import { LanguageId } from "./enums";
import { Language } from "./interfaces/Language";

export const UNKNOWN_LANGUAGE: Language = {
  id: LanguageId.UNKNOWN,
  name: "Dowolny",
  monacoForm: "plain",
};

export const ALL_LANGUAGES: Language[] = [
  UNKNOWN_LANGUAGE,
  {
    id: LanguageId.PYTHON_3_8_1,
    name: "Python 3.8",
    monacoForm: "python",
  },
  {
    id: LanguageId.C,
    name: "C",
    monacoForm: "c",
  },
  {
    id: LanguageId.CPP,
    name: "C++",
    monacoForm: "cpp",
  },
  // {
  //   id: LanguageId.CS,
  //   name: "C#",
  //   monacoForm: "cs",
  // },
  {
    id: LanguageId.JAVA_13,
    name: "Java 13",
    monacoForm: "java",
  },
  // {
  //   id: LanguageId.JAVASCRIPT_NODE_12_14,
  //   name: "JavaScript",
  //   monacoForm: "javascript",
  // },
  // {
  //   id: LanguageId.TYPESCRIPT_3_7_4,
  //   name: "TypeScript 3.7",
  //   monacoForm: "typescript",
  // },
];

export const getLanguageById = (languageId: number) => {
  return (
    ALL_LANGUAGES.find((language) => language.id === languageId) ??
    UNKNOWN_LANGUAGE
  );
};

export const USER_FIRST_NAME_LENGTH_LIMIT = 32;
export const USER_LAST_NAME_LENGTH_LIMIT = 32;
export const USER_EMAIL_LENGTH_LIMIT = 256;

export const PROBLEM_NAME_LENGTH_LIMIT = 128;
export const PROBLEM_DESCRIPTION_LENGTH_LIMIT = 512;
export const PROBLEM_PROMPT_LENGTH_LIMIT = 10_000;

export const TEST_INPUT_LENGTH_LIMIT = 64;
export const TEST_EXPECTED_VALUE_LENGTH_LIMIT = 64;

export const dateTimeFormat = "DD.MM.YYYY - HH:mm";
