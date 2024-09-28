import { UserLoggedCheck } from "../../checks/UserLoggedCheck";
import { StagesView } from "./editViews/stages/StagesView";
import { ContestContextProvider } from "../../shared/useContestContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { mapIfPresent } from "../../shared/mapper";

export const ContestEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const contestId = useMemo(() => {
    const resolvedId = mapIfPresent(id, parseInt);
    if (!resolvedId) {
      navigate("/contests");
      return -1;
    }
    return resolvedId;
  }, [id, navigate]);

  return (
    <UserLoggedCheck>
      <ContestContextProvider contestId={contestId}>
        <div className="flex flex-col justify-center gap-4 overflow-x-auto mx-12 pt-12">
          <StagesView />
          {/* <ContestBaseView contestId={contestId} /> */}
          {/* <ContestParticipantsView contestId={contestId} /> */}
        </div>
      </ContestContextProvider>
    </UserLoggedCheck>
  );
};
