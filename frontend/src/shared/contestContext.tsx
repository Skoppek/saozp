import { createContext } from "react";

export interface Contest {
  id: number;
}

export const ContestContext = createContext<Contest | undefined>(undefined);

