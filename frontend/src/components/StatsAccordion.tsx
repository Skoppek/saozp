import {
  Accordion,
  AccordionContent,
} from "flowbite-react/components/Accordion";
import { Submission, SubmissionEntry } from "../shared/interfaces";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { CodeEditor } from "./CodeEditor";
import { getLanguageById } from "../shared/constansts";
import { TestPanelStats } from "./TestPanelStats";
import { TestResultList } from "./TestResultList";
import { ResultPanelTitle } from "./results/ResultPanelTitle";

interface StatsAccordionProps {
  submission: SubmissionEntry;
}

export const StatsAccordion = ({ submission }: StatsAccordionProps) => {
  const [isOpen, setOpen] = useState(false);
  const [details, setDetails] = useState<Submission>();

  useEffect(() => {
    if (isOpen && !details) {
      console.log("deeee");
      apiClient
        .getSubmissionById(submission.submissionId)
        .then((data) => {
          setDetails(data);
        })
        .catch(() => console.log("co do kurwy"));
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
