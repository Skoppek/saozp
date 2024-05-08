import {
  Accordion,
  AccordionContent,
} from "flowbite-react/components/Accordion";
import { Submission, SubmissionEntry } from "../../shared/interfaces";
import { useEffect, useState } from "react";
import apiClient from "../../apiClient";
import { Button } from "flowbite-react/components/Button";
import { TestPanelStats } from "../TestPanelStats";
import { TestResultList } from "../TestResultList";
import { ResultPanelTitle } from "./ResultPanelTitle";

interface ResultPanelProps {
  submission: SubmissionEntry;
  onCheckCode: (submission: Submission) => void;
}

export const ResultPanel = ({ submission, onCheckCode }: ResultPanelProps) => {
  const [isOpen, setOpen] = useState(false);
  const [details, setDetails] = useState<Submission>();

  useEffect(() => {
    if (isOpen && !details) {
      apiClient.getSubmissionById(submission.submissionId).then((data) => {
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
          {details && (
            <div className="flex flex-col gap-2">
              <TestPanelStats submission={details} />
              <Button size="xs" onClick={() => onCheckCode(details)}>
                Zobacz
              </Button>
              <TestResultList tests={details.result.tests} />
            </div>
          )}
        </AccordionContent>
      </Accordion.Panel>
    </Accordion>
  );
};
