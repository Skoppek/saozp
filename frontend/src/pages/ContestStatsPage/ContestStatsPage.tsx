import { useParams } from "react-router-dom";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck";
import { useNumberParam } from "../../shared/useParam";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { RerunButton } from "../../components/RerunButton";
import { Spinner } from "flowbite-react";
import _ from "lodash";
import { StatsTable } from "./StatsTable";
import { ContestContextProvider } from "../../shared/useContestContext";

export const ContestStatsPage = () => {
  const { id } = useParams();
  const { value: contestIdValue } = useNumberParam({
    param: id,
  });

  const { data, isFetching } = useQuery({
    queryKey: ["contest", contestIdValue, "stats"],
    queryFn: () => apiClient.contests.get(contestIdValue!),
    enabled: !!contestIdValue,
  });

  const { data: participants } = useQuery({
    queryKey: ["contest", contestIdValue, "participants", "stats"],
    queryFn: () => apiClient.contests.getParticipants(contestIdValue!),
    enabled: !!contestIdValue,
  });

  const { data: stages } = useQuery({
    queryKey: ["contest", contestIdValue, "stages", "stats"],
    queryFn: () => apiClient.contests.getStagesStats(contestIdValue!),
    enabled: !!contestIdValue,
  });

  return (
    <UserLoggedCheck>
      {data && !isFetching && (
        <div className="flex flex-col items-center gap-4 overflow-x-auto pt-8">
          {contestIdValue && (
            <ContestContextProvider contestId={contestIdValue}>
              <div className="text-4xl">{data.name}</div>
              <RerunButton contestId={contestIdValue} />
              {participants && stages ? (
                <StatsTable participants={participants} stages={stages} />
              ) : (
                <Spinner />
              )}
            </ContestContextProvider>
          )}
        </div>
      )}
    </UserLoggedCheck>
  );
};
