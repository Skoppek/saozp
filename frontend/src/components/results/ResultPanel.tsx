import {
  Accordion,
  AccordionContent,
} from "flowbite-react/components/Accordion";
import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry";
import { useState } from "react";
import { TestResultList } from "./TestResultList.tsx";
import { ResultPanelTitle } from "./ResultPanelTitle";
import { CodeEditor } from "../CodeEditor";
import { getLanguageById } from "../../shared/constansts";
import { Spinner } from "flowbite-react/components/Spinner";
import apiClient from "../../client/apiClient.ts";
import { TestPanelStats } from "./TestPanelStats.tsx";
import { useQuery } from "@tanstack/react-query";
import { Button } from "flowbite-react";

interface ResultPanelProps {
  submission: SubmissionEntry;
}

export const ResultPanel = ({ submission }: ResultPanelProps) => {
  const [isOpen, setOpen] = useState(false);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["submission", submission.submissionId, "results"],
    queryFn: () => apiClient.submissions.get(submission.submissionId),
    enabled: isOpen,
  });

  return (
    <Accordion collapseAll onClick={() => setOpen((prev) => !prev)}>
      <Accordion.Panel>
        <Accordion.Title
          className={`${submission.isCommit ? "bg-teal-800/10 dark:bg-teal-800/50" : ""}`}
        >
          <ResultPanelTitle submission={submission} showCommitFlag={true} />
        </Accordion.Title>
        <AccordionContent>
          {data && !isFetching ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-row justify-between w-full">
                <TestPanelStats submission={data} />
                <Button onClick={() => refetch()} size={"xs"}>
                  Odśwież
                </Button>
              </div>
              <div className="h-80 w-full">
                <CodeEditor
                  languages={getLanguageById(data.languageId)}
                  code={data.code}
                  className="size-full"
                />
              </div>
              <TestResultList tests={data.result.tests} />
            </div>
          ) : (
            <div className="flex w-screen justify-center">
              <Spinner aria-label="Extra large spinner" size="xl" />
            </div>
          )}
        </AccordionContent>
      </Accordion.Panel>
    </Accordion>
  );
};
