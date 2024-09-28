import { Accordion, Badge, Spinner } from "flowbite-react";
import { CreateStageModal } from "./CreateStageModal";
import { useContestContext } from "../../../../shared/useContest";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../client/apiClient";

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
        <div className="flex flex-col gap-4">
          <CreateStageModal onCreate={() => refetch()} />
          <Accordion className="w-[800px]">
            {data.map((stage) => (
              <Accordion.Panel>
                <Accordion.Title>
                  <div className="flex justify-between w-[700px]">
                    <Badge>{new Date().toLocaleString()}</Badge>
                    <div>{stage.name}</div>
                    <Badge>{new Date().toLocaleString()}</Badge>
                  </div>
                </Accordion.Title>
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
