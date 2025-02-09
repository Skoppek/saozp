import { createContext } from "react";
import { Problem } from "../../shared/interfaces/Problem";

export interface ProblemContextValue {
  problem: Problem;
  setProblem: (problem: Problem) => void;
}

export const ProblemContext = createContext<ProblemContextValue | undefined>(
  undefined,
);
