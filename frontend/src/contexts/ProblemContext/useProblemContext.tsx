import { useContext } from "react";
import { ProblemContext, ProblemContextValue } from "./ProblemContext";

export const useProblemContext = (): ProblemContextValue => {
    const context = useContext(ProblemContext);
    if (!context) {
        throw new Error(
            "useProblemContext must be used with ProblemContextProvider"
        );
    }
    return context;
};
