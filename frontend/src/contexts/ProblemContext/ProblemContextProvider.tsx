import { ReactNode, useEffect, useState } from "react";
import apiClient from "../../client/apiClient";
import { Problem } from "../../shared/interfaces/Problem";
import { ProblemContext } from "./ProblemContext";

export const ProblemContextProvider = ({
  problemId,
  children,
}: {
  problemId: number;
  children?: ReactNode;
}) => {
  const [problem, setProblem] = useState<Problem>();

  useEffect(() => {
    apiClient.problems.get(problemId).then((data) => {
      setProblem(data);
    });
  }, [problemId]);

  return (
    <div>
      {problem ? (
        <ProblemContext.Provider
          value={{
            problem,
            setProblem,
          }}
        >
          {children}
        </ProblemContext.Provider>
      ) : (
        <div></div>
      )}
    </div>
  );
};
