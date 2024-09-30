import { useParams } from "react-router-dom";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck";
import { useNumberParam } from "../../shared/useParam";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { useState, useMemo } from "react";
import { LiveSubmissionView } from "./LiveSubmissionView";
import { RerunButton } from "../../components/RerunButton";
import { Table } from "flowbite-react/components/Table";
import { Spinner } from "flowbite-react";
import { displayNames } from "../../shared/functions";
import _ from "lodash";
import { ScoreButton } from "./ScoreButton";

export const ContestStatsPage = () => {
  const { id } = useParams();
  const { value: contestIdValue } = useNumberParam({
    param: id,
  });

  const [selected, setSelected] = useState<number | undefined>();

  const { data, isFetching } = useQuery({
    queryKey: ["contest", contestIdValue, "stats"],
    queryFn: () => apiClient.contests.get(contestIdValue!),
    enabled: !!contestIdValue,
  });

  const { data: participants, isFetching: isFetchingParticipants } = useQuery({
    queryKey: ["contest", contestIdValue, "participants", "stats"],
    queryFn: () => apiClient.contests.getParticipants(contestIdValue!),
    enabled: !!contestIdValue,
  });

  const { data: stages, isFetching: isFetchingStages } = useQuery({
    queryKey: ["contest", contestIdValue, "stages", "stats"],
    queryFn: () => apiClient.contests.getStagesStats(contestIdValue!),
    enabled: !!contestIdValue,
  });

  const sortedStages = useMemo(() => {
    return stages && !isFetchingStages
      ? _(stages).sortBy("stage.startDate").value()
      : undefined;
  }, [stages, isFetchingStages]);

  return (
    <UserLoggedCheck>
      <div className="flex flex-col gap-4">
        {data && !isFetching && (
          <div className="flex flex-col items-center gap-4 overflow-x-auto pt-8">
            <div className="flex flex-col items-center gap-2">
              <div className="text-4xl">{data.name}</div>
              <div className="flex flex-col gap-4 items-center">
                {contestIdValue && <RerunButton contestId={contestIdValue} />}
              </div>
            </div>
            {contestIdValue && (
              <div className="flex gap-4">
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Uczestnik</Table.HeadCell>
                    {sortedStages &&
                      sortedStages.map((stage) => (
                        <Table.HeadCell>{stage.stage.id}</Table.HeadCell>
                      ))}
                  </Table.Head>
                  <Table.Body>
                    {participants && !isFetchingParticipants ? (
                      participants.map((participant) => (
                        <Table.Row>
                          <Table.Cell>{displayNames(participant)}</Table.Cell>
                          {sortedStages &&
                            sortedStages.map((stage) => (
                              <Table.Cell>
                                <ScoreButton
                                  value={
                                    stage.results.find(
                                      (x) =>
                                        x.participantId === participant.userId,
                                    )?.result ?? 0
                                  }
                                />
                              </Table.Cell>
                            ))}
                        </Table.Row>
                      ))
                    ) : (
                      <Spinner />
                    )}
                  </Table.Body>
                </Table>
                {selected && (
                  <LiveSubmissionView
                    contestId={contestIdValue}
                    problemId={selected}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </UserLoggedCheck>
  );
};
