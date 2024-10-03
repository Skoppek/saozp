import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { Badge, Spinner } from "flowbite-react";
import { getLanguageById } from "../../shared/constansts";
import { TestResultList } from "../../components/results/TestResultList";
import { CodeEditor } from "../../components/CodeEditor";

export const LastSubmissionView = ({
  submissionId,
}: {
  submissionId: number;
}) => {
  const { data: submission } = useQuery({
    queryKey: ["submission", submissionId],
    queryFn: () => apiClient.submissions.get(submissionId),
  });

  return (
    <>
      {submission ? (
        <div className="flex flex-col gap-4 items-center w-full">
          <Badge size="sm" color={"dark"}>
            IP: {submission.ip ?? "N/A"}
          </Badge>
          <div className="w-full h-[200px]">
            <CodeEditor
              languages={getLanguageById(submission.languageId)}
              code={submission.code}
              className="size-full"
            />
          </div>
          <TestResultList
            tests={submission.result.tests.filter(
              (test) => test.expected != test.received,
            )}
          />
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};
