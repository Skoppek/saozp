export interface User {
  userId: number;
  firstName: string;
  lastName: string;
}

export const isUser = (suspect: unknown): suspect is User => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    "userId" in suspect &&
    typeof suspect.userId === "number" &&
    "firstName" in suspect &&
    typeof suspect.firstName === "string" &&
    "lastName" in suspect &&
    typeof suspect.lastName === "string"
  );
};
