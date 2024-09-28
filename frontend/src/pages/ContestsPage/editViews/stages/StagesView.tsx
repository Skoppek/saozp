import { Accordion, Badge, Spinner } from "flowbite-react";
import { CreateStageModal } from "./CreateStageModal";
import { useContestContext } from "../../../../shared/useContestContext";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../client/apiClient";
import _ from "lodash";
import { displayDateTime } from "../../../../shared/functions";
import { StageProblemsView } from "../problems/StageProblemsView";

export const StagesView = () => {
  const { id: contestId } = useContestContext();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["contestEdit", "stages", contestId],
    queryFn: () => apiClient.contests.getStages(contestId!),
    enabled: !!contestId,
  });

  return (
    <div className="w-full">
      {data && !isFetching ? (
        <div className="flex flex-col items-center gap-4">
          <CreateStageModal onCreate={() => refetch()} />
          <Accordion className="w-[800px]">
            {_(data)
              .sortBy("startDate")
              .value()
              .map((stage) => (
                <Accordion.Panel>
                  <Accordion.Title>
                    <div className="flex justify-between w-[700px]">
                      <Badge size="sm">
                        {displayDateTime(stage.startDate)}
                      </Badge>
                      <div>{stage.name}</div>
                      <Badge size="sm">{displayDateTime(stage.endDate)}</Badge>
                    </div>
                  </Accordion.Title>
                  <Accordion.Content>
                    <div className="flex flex-col gap-4">
                      <CreateStageModal
                        onCreate={() => refetch()}
                        defaultValue={stage}
                        stageId={stage.id}
                      />
                      <StageProblemsView stageId={stage.id} />
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              ))}
          </Accordion>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
