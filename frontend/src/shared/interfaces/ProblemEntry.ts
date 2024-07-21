import { Problem } from "./Problem";
import { User } from "./User";

export interface ProblemEntry
  extends Pick<
    Problem,
    "problemId" | "name" | "description" | "languageId" | "activeAfter"
  > {
  creator: User;
}
