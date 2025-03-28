import { Problem } from "./Problem";

export interface ProblemEntry
  extends Pick<
    Problem,
    "problemId" | "name" | "languageId" | "isContestsOnly"
  > {
  creator: {
    userId: number;
    firstName: string;
    lastName: string;
  };
}
