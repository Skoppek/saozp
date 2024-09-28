import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mapIfPresent } from "../../../backend/src/shared/mapper";

interface Contest {
  id?: number;
}

const ContestContext = createContext<Contest | undefined>(undefined);

export const ContestContextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const contestId = useMemo(() => {
    const resolvedId = mapIfPresent(id, parseInt);
    if (!resolvedId) {
      navigate("/contests");
    }
    return resolvedId;
  }, [id, navigate]);

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
