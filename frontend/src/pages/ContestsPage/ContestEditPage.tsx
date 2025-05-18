import { UserLoggedCheck } from "../../checks/UserLoggedCheck";
import { StagesView } from "./editViews/stages/StagesView";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { mapIfPresent } from "../../shared/mapper";
import { ContestParticipantsView } from "./editViews/participants/ContestParticipantsView";
import { ContestBaseView } from "./editViews/ContestBaseView";
import { ContestContextProvider } from "../../shared/ContestContextProvider";

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
        <div className="mx-12 flex justify-center gap-4 overflow-x-auto pt-12">
          <div className="flex flex-col gap-4">
            <ContestBaseView />
            <hr className="border-black" />
            <StagesView />
          </div>
          <ContestParticipantsView />
        </div>
      </ContestContextProvider>
    </UserLoggedCheck>
  );
};
