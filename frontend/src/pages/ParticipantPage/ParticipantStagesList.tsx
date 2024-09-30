import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { Accordion, Button, Spinner } from "flowbite-react";
import { InfoCard } from "../../components/InfoCard";
import { HiEyeOff } from "react-icons/hi";
import { StageProblems } from "./StageProblems";

export const ParticipantStagesList = ({ contestId }: { contestId: number }) => {
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["participant", "problems", contestId],
    queryFn: () => apiClient.contests.getStages(contestId),
  });

  return (
    <>
      {data && !isFetching ? (
        <Accordion collapseAll className="w-[500px]">
          {data?.map((stage, index) => (
            <Accordion.Panel id={index.toString()}>
              <Accordion.Title>
                <div className="flex w-[400px] justify-between">
                  <div>{stage.name}</div>
                </div>
              </Accordion.Title>
              <Accordion.Content>
                <StageProblems contestId={contestId} stageId={stage.id} />
              </Accordion.Content>
            </Accordion.Panel>
          ))}
        </Accordion>
      ) : isError ? (
        <InfoCard>
          <div className="flex flex-col items-center justify-center gap-2">
            <HiEyeOff size={120} />
            <span>Te zawody jeszcze się nie zaczęły</span>
            <Button onClick={() => refetch()}>Odśwież</Button>
          </div>
        </InfoCard>
      ) : (
        <Spinner />
      )}
    </>
  );
};
