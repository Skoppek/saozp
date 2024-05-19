export interface User {
  userId: number;
  login: string;
  firstName: string;
  lastName: string;
  isAdmin?: true;
}

export const isUser = (suspect: unknown): suspect is User => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    "userId" in suspect &&
    typeof suspect.userId === "number" &&
    "login" in suspect &&
    typeof suspect.login === "string" &&
    "firstName" in suspect &&
    typeof suspect.firstName === "string" &&
    "lastName" in suspect &&
    typeof suspect.lastName === "string"
  );
};
