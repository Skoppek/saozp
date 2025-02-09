import { createContext, ReactNode, useContext, useState } from "react";
import { Problem } from "../shared/interfaces/Problem";
import apiClient from "../client/apiClient";

interface ProblemContextValue {
    problem: Problem,
    setProblem: (problem: Problem) => void;
} 

const ProblemContext = createContext<ProblemContextValue | undefined>(undefined);

export const ProblemContextProvider = ({problemId, children}: {problemId: number, children?: ReactNode}) => {
    const [problem, setProblem] = useState<Problem>();
    
    apiClient.problems
      .get(problemId, true)
      .then((data) => setProblem(data))

    return <div>
        {problem ? <ProblemContext.Provider value={{
            problem,
            setProblem
        }}>{children}</ProblemContext.Provider> : <div></div>}
    </div>
}

export const useProblemContext = (): ProblemContextValue => {
    const context = useContext(ProblemContext);
    if (!context) {
        throw new Error("useProblemContext must be used with ProblemContextProvider");
    }
    return context;
}