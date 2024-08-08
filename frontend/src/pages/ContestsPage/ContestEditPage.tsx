import { useNavigate, useParams } from "react-router-dom";
import { AuthenticatedPage } from "../AuthenticatedPage";
import { mapIfPresent } from "../../shared/mapper";
import { useMemo } from "react";
import { ContestBaseView } from "./editViews/ContestBaseView";
import { ContestParticipantsView } from "./editViews/participants/ContestParticipantsView";
import { ContestProblemsView } from "./editViews/problems/ContestProblemsView";

export const ContestEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const contestId = useMemo(() => {
    const resolvedId = mapIfPresent(id, parseInt);
    if (!resolvedId) {
      navigate("/contests");
    }
    return resolvedId;
  }, [id]);

  return (
    <AuthenticatedPage>
      <div className="flex flex-col gap-4 mx-12">
        <div className="flex justify-center gap-4 overflow-x-auto pt-12">
          {contestId && (
            <div className="grid grid-cols-3 gap-4">
              <ContestBaseView contestId={contestId} />
              <ContestParticipantsView contestId={contestId} />
              <ContestProblemsView contestId={contestId} />
            </div>
          )}
        </div>
      </div>
    </AuthenticatedPage>
  );
};
