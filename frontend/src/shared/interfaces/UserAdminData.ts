import pick from "lodash/pick";
import { User, isUser } from "./User";

export interface UserAdminData extends User {
  sessionId?: string;
  sessionExpiryDate?: string;
}

export const isUserAdminData = (suspect: unknown): suspect is UserAdminData => {
  return (
    typeof suspect === "object" &&
    suspect != null &&
    isUser(
      pick(suspect, ["userId", "login", "firstName", "lastName", "isAdmin"]),
    ) &&
    (() => {
      if ("sessionId" in suspect) {
        return typeof suspect.sessionId === "string";
      }
      return true;
    })() &&
    (() => {
      if ("sessionExpiryDate" in suspect) {
        return typeof suspect.sessionExpiryDate === "string";
      }
      return true;
    })()
  );
};

export const isUserAdminDataArray = (
  suspect: unknown,
): suspect is UserAdminData[] => {
  return (
    Array.isArray(suspect) && suspect.every((item) => isUserAdminData(item))
  );
};
