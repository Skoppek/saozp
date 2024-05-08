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

export const enum TestStatus {
  UNKNOWN = 0,
  IN_QUEUE = 1,
  PROCESSING = 2,
  ACCEPTED = 3,
  WRONG_ANSWER = 4,
  TIME_LIMIT_EXCEEDED = 5,
  ERROR = 6,
}

export const STATUS_NAMES: Record<TestStatus, string> = {
  [TestStatus.UNKNOWN]: "Nieznany",
  [TestStatus.IN_QUEUE]: "W kolejce",
  [TestStatus.PROCESSING]: "Wykonywanie",
  [TestStatus.ACCEPTED]: "Zaakceptowano",
  [TestStatus.WRONG_ANSWER]: "Błędna odpowiedź",
  [TestStatus.TIME_LIMIT_EXCEEDED]: "Przekroczono czas",
  [TestStatus.ERROR]: "Błąd",
};

export const STATUS_COLORS: Record<TestStatus, string> = {
  [TestStatus.UNKNOWN]: "neutral",
  [TestStatus.IN_QUEUE]: "indigo",
  [TestStatus.PROCESSING]: "purple",
  [TestStatus.ACCEPTED]: "success",
  [TestStatus.WRONG_ANSWER]: "failure",
  [TestStatus.TIME_LIMIT_EXCEEDED]: "warning",
  [TestStatus.ERROR]: "failure",
};
