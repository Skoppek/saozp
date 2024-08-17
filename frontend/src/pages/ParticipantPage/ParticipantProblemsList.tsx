import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { Accordion, Button, Spinner } from "flowbite-react";
import { ParticipantsSubmissions } from "./ParticipantSubmissions";
import { LinkButton } from "../../components/LinkButton";
import { InfoCard } from "../../components/InfoCard";
import { HiEyeOff } from "react-icons/hi";

interface ParticipantProblemsListProps {
  contestId: number;
}

export const ParticipantProblemsList = ({
  contestId,
}: ParticipantProblemsListProps) => {
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["participant", "problems", contestId],
    queryFn: () => apiClient.contests.getProblems(contestId),
  });

  return (
    <>
      {data && !isFetching ? (
        <Accordion className="w-[500px]">
          {data?.map((problem, index) => (
            <Accordion.Panel id={index.toString()}>
              <Accordion.Title>
                <div className="flex w-[400px] justify-between">
                  <div>{problem.name}</div>
                  <LinkButton
                    to={`/contests/${contestId}/problem/${problem.problemId}`}
                    label="Rozwiąż"
                    buttonProps={{ size: "xs" }}
                  />
                </div>
              </Accordion.Title>
              <Accordion.Content>
                <ParticipantsSubmissions
                  problemId={problem.problemId}
                  contestId={contestId}
                />
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
