import { useMemo } from "react";
import { Contest, ContestContext } from "./contestContext";

export const ContestContextProvider = ({
  children,
  contestId,
}: {
  children?: React.ReactNode;
  contestId: number;
}) => {
  const ctxValue = useMemo<Contest>(
    () => ({
      id: contestId,
    }),
    [contestId],
  );

  return (
    <ContestContext.Provider value={ctxValue}>
      {children}
    </ContestContext.Provider>
  );
};