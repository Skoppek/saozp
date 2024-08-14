import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { Accordion, Spinner } from "flowbite-react";
import { ParticipantsSubmissions } from "./ParticipantSubmissions";
import { LinkButton } from "../../components/LinkButton";

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
              <Accordion.Title>
                <div className="flex justify-between w-[400px]">
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
      ) : (
        <Spinner />
      )}
    </>
  );
};
