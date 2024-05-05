export const enum LanguageId {
  UNKNOWN = -1,
  C = 50,
  CPP = 54,
  CS = 51,
  JAVA_13 = 62,
  PYTHON_3_8_1 = 71,
  TYPESCRIPT_3_7_4 = 74,
  JAVASCRIPT_NODE_12_14 = 63,
}

export const STATUS_NAMES: Record<number, string> = {
  0: "Nieznany",
  1: "W kolejce",
  2: "Wykonywanie",
  3: "Zaakceptowano",
  4: "Błędna odpowiedź",
  5: "Przekroczono czas",
  6: "Błąd",
};
