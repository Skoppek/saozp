import { createContext, useContext, useMemo } from "react";

interface Contest {
  id: number;
}

const ContestContext = createContext<Contest | undefined>(undefined);

export const ContestContextProvider = ({
  children,
  contestId,
}: {
  children?: React.ReactNode;
  contestId: number;
}) => {
  const ctxValue = useMemo<Contest>(() => {
    return {
      id: contestId,
    };
  }, []);

  return (
    <ContestContext.Provider value={ctxValue}>
      {children}
    </ContestContext.Provider>
  );
};

export const useContestContext = () => {
  const ctx = useContext(ContestContext);
  if (!ctx) {
    throw new Error(
      "useContestContext must be used within ContestContextProvider",
    );
  }
  return ctx;
};
