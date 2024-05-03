import { LanguageId } from "./enums";
import { Language } from "./interfaces";

export const ALL_LANGUAGES: Language[] = [
  {
    id: LanguageId.UNKNOWN,
    name: "Dowolny",
    monacoForm: "plain",
  },
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
  {
    id: LanguageId.CS,
    name: "C#",
    monacoForm: "cs",
  },
  {
    id: LanguageId.JAVA_13,
    name: "Java 13",
    monacoForm: "java",
  },
  {
    id: LanguageId.JAVASCRIPT_NODE_12_14,
    name: "JavaScript",
    monacoForm: "javascript",
  },
  {
    id: LanguageId.TYPESCRIPT_3_7_4,
    name: "TypeScript 3.7",
    monacoForm: "typescript",
  },
];
