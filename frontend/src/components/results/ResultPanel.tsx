import {
  Accordion,
  AccordionContent,
} from "flowbite-react/components/Accordion";
import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry";
import { Submission } from "../../shared/interfaces/Submission";
import { useEffect, useState } from "react";
import { TestResultList } from "./TestResultList.tsx";
import { ResultPanelTitle } from "./ResultPanelTitle";
import { CodeEditor } from "../CodeEditor";
import { getLanguageById } from "../../shared/constansts";
import { Spinner } from "flowbite-react/components/Spinner";
import apiClient from "../../client/apiClient.ts";
import { TestPanelStats } from "./TestPanelStats.tsx";

interface ResultPanelProps {
  submission: SubmissionEntry;
}

export const ResultPanel = ({ submission }: ResultPanelProps) => {
  const [isOpen, setOpen] = useState(false);
  const [details, setDetails] = useState<Submission>();

  useEffect(() => {
    if (isOpen && !details) {
      apiClient.submissions.get(submission.submissionId).then((data) => {
        setDetails(data);
      });
    }
  }, [details, isOpen, submission.submissionId]);

  return (
    <Accordion collapseAll onClick={() => setOpen((prev) => !prev)}>
      <Accordion.Panel>
        <Accordion.Title
          className={`${submission.isCommit ? "bg-teal-800/10 dark:bg-teal-800/50" : ""}`}
        >
          <ResultPanelTitle submission={submission} showCommitFlag={true} />
        </Accordion.Title>
        <AccordionContent>
          {details ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex justify-between">
                <TestPanelStats submission={details} />
              </div>
              <div className="h-80 w-full">
                <CodeEditor
                  languages={getLanguageById(details.languageId)}
                  code={details.code}
                  className="size-full"
                />
              </div>
              <TestResultList tests={details.result.tests} />
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
