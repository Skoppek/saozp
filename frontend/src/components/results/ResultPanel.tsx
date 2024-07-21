import {
  Accordion,
  AccordionContent,
} from "flowbite-react/components/Accordion";
import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry";
import { Submission } from "../../shared/interfaces/Submission";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { TestPanelStats } from "../TestPanelStats";
import { TestResultList } from "../TestResultList";
import { ResultPanelTitle } from "./ResultPanelTitle";
import { CodeEditor } from "../CodeEditor";
import { getLanguageById } from "../../shared/constansts";
import { Spinner } from "flowbite-react/components/Spinner";
import apiClient from "../../client/apiClient.ts";

interface ResultPanelProps {
  submission: SubmissionEntry;
  onCheckCode: (submission: Submission) => void;
}

export const ResultPanel = ({ submission, onCheckCode }: ResultPanelProps) => {
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
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <TestPanelStats submission={details} />
                <Button size="xs" onClick={() => onCheckCode(details)}>
                  Wklej rozwiązanie
                </Button>
              </div>
              <div className="flex gap-4">
                <TestResultList tests={details.result.tests} />
                <div className="h-[40vh] w-1/2">
                  <CodeEditor
                    languages={getLanguageById(details.languageId)}
                    code={details.code}
                    className="size-full"
                  />
                </div>
              </div>
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
