import { ProblemEntry } from "./interfaces";

export const isProblemEntry = (suspect: object): suspect is ProblemEntry => {
  const requiredProps =
    "problemId" in suspect &&
    typeof suspect.problemId === "number" &&
    "name" in suspect &&
    typeof suspect.name === "string" &&
    "languageId" in suspect &&
    typeof suspect.languageId === "number";

  return "description" in suspect
    ? requiredProps && typeof suspect.description === "string"
    : requiredProps;
};

export const isProblemsEntryArray = (
  response: object,
): response is ProblemEntry[] => {
  return (
    Array.isArray(response) && response.every((item) => isProblemEntry(item))
  );
};
