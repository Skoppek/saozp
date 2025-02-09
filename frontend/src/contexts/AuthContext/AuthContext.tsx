import { createContext } from "react";
import { User } from "../../shared/interfaces/User";

export const AuthContext = createContext<
  {
    user?: User;
    setUser: (value?: User) => void;
  } |
  undefined
>(undefined);
