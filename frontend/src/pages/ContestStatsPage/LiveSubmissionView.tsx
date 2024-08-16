import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { ResultPanel } from "../../components/results/ResultPanel";
import { Spinner } from "flowbite-react";
import { displayNames } from "../../shared/functions";
import { HiOutlineCubeTransparent } from "react-icons/hi";

interface LiveSubmissionViewProps {
  contestId: number;
  problemId: number;
}

export const LiveSubmissionView = ({
  contestId,
  problemId,
}: LiveSubmissionViewProps) => {
  const { data, isFetching } = useQuery({
    queryKey: ["contest", contestId, problemId, "stats", "live"],
    queryFn: () =>
      apiClient.submissions.getMany({
        contestId,
        problemId,
        commitsOnly: true,
      }),
  });
  return (
    <>
      {data && !isFetching ? (
        <div className="flex flex-col gap-2">
          {data.length ? (
            data.map((submission) => (
              <div>
                {submission.creator && (
                  <span>{displayNames(submission.creator)}</span>
                )}
                <ResultPanel submission={submission} />
              </div>
            ))
          ) : (
            <div className="flex h-[250px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="prose break-words dark:prose-invert">
                <div className="flex flex-col items-center">
                  <HiOutlineCubeTransparent size={120} />
                  <span>Jeszcze nie zgłoszono rozwiązań</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};
