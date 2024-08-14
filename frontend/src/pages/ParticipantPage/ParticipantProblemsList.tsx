import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { Accordion, Spinner } from "flowbite-react";

interface ParticipantProblemsListProps {
  contestId: number;
}

export const ParticipantProblemsList = ({
  contestId,
}: ParticipantProblemsListProps) => {
  const { data, isFetching } = useQuery({
    queryKey: ["participant", "problems", contestId],
    queryFn: () => apiClient.contests.getProblems(contestId),
  });

  return (
    <>
      {data && !isFetching ? (
        <Accordion className="w-[500px]">
          {data?.map((problem, index) => (
            <Accordion.Panel id={index.toString()}>
              <Accordion.Title>{problem.name}</Accordion.Title>
              <Accordion.Content></Accordion.Content>
            </Accordion.Panel>
          ))}
        </Accordion>
      ) : (
        <Spinner />
      )}
    </>
  );
};
