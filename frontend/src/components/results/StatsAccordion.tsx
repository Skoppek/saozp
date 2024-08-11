import {
  Accordion,
  AccordionContent,
} from "flowbite-react/components/Accordion";
import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry.ts";
import { Submission } from "../../shared/interfaces/Submission.ts";
import { useEffect, useState } from "react";
import { CodeEditor } from "../CodeEditor.tsx";
import { getLanguageById } from "../../shared/constansts.ts";
import { TestResultList } from "../results/TestResultList.tsx";
import { ResultPanelTitle } from "../results/ResultPanelTitle.tsx";
import apiClient from "../../client/apiClient.ts";
import { TestPanelStats } from "../testCases/TestPanelStats.tsx";

interface StatsAccordionProps {
  submission: SubmissionEntry;
}

export const StatsAccordion = ({ submission }: StatsAccordionProps) => {
  const [isOpen, setOpen] = useState(false);
  const [details, setDetails] = useState<Submission>();

  useEffect(() => {
    if (isOpen && !details) {
      apiClient.submissions
        .get(submission.submissionId)
        .then((data) => setDetails(data));
    }
  }, [details, isOpen, submission.submissionId]);

  return (
    <Accordion collapseAll onClick={() => setOpen((prev) => !prev)}>
      <Accordion.Panel>
        <Accordion.Title
          className={`${submission.isCommit ? "bg-teal-800/10 dark:bg-teal-800/50" : ""}`}
        >
          <ResultPanelTitle submission={submission} showAuthor={true} />
        </Accordion.Title>
        <AccordionContent>
          {details && (
            <div className="flex flex-col gap-2">
              <TestPanelStats submission={details} />
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
          )}
        </AccordionContent>
      </Accordion.Panel>
    </Accordion>
  );
};
