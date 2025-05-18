import { useContext } from "react";
import { ContestContext } from "./contestContext";

export const useContestContext = () => {
  const ctx = useContext(ContestContext);
  if (!ctx) {
    throw new Error(
      "useContestContext must be used within ContestContextProvider",
    );
  }
  return ctx;
};
