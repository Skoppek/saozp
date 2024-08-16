import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { Accordion } from "flowbite-react/components/Accordion";
import { Spinner } from "flowbite-react/components/Spinner";
import { StatsTopSubmissionsDetails } from "./StatsTopSubmissionsDetails";
import { useState } from "react";

interface StatsTopSubmissionsProps {
  contestId: number;
  onProblemOpen: (id: number | undefined) => void;
}

export const StatsTopSubmissions = ({
  contestId,
  onProblemOpen,
}: StatsTopSubmissionsProps) => {
  const [_, setSelected] = useState<number | undefined>();

  const { data, isFetching } = useQuery({
    queryKey: ["contest", contestId, "problems", "top"],
    queryFn: () => apiClient.contests.getProblems(contestId),
  });

  return (
    <>
      {data && !isFetching ? (
        <Accordion className="w-[500px]" collapseAll>
          {data?.map((problem, index) => (
            <Accordion.Panel id={index.toString()}>
              <div
                onClick={() =>
                  setSelected((prev) => {
                    const result =
                      prev === problem.problemId
                        ? undefined
                        : problem.problemId;
                    onProblemOpen(result);
                    return result;
                  })
                }
              >
                <Accordion.Title>
                  <div className="flex justify-between w-[400px]">
                    <div>{problem.name}</div>
                  </div>
                </Accordion.Title>
                <Accordion.Content>
                  <StatsTopSubmissionsDetails
                    problemId={problem.problemId}
                    contestId={contestId}
                  />
                </Accordion.Content>
              </div>
            </Accordion.Panel>
          ))}
        </Accordion>
      ) : (
        <Spinner />
      )}
    </>
  );
};
