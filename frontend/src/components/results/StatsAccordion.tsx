import {
  Accordion,
  AccordionContent,
} from "flowbite-react/components/Accordion";
import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry.ts";
import { useState } from "react";
import { CodeEditor } from "../CodeEditor.tsx";
import { getLanguageById } from "../../shared/constansts.ts";
import { TestResultList } from "../results/TestResultList.tsx";
import { ResultPanelTitle } from "../results/ResultPanelTitle.tsx";
import apiClient from "../../client/apiClient.ts";
import { TestPanelStats } from "./TestPanelStats.tsx";
import { useQuery } from "@tanstack/react-query";

interface StatsAccordionProps {
  submission: SubmissionEntry;
}

export const StatsAccordion = ({ submission }: StatsAccordionProps) => {
  const [isOpen, setOpen] = useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ["submission", submission.submissionId, "details"],
    queryFn: () => apiClient.submissions.get(submission.submissionId),
    enabled: isOpen,
  });

  return (
    <Accordion collapseAll onClick={() => setOpen((prev) => !prev)}>
      <Accordion.Panel>
        <Accordion.Title>
          <ResultPanelTitle submission={submission} showAuthor={true} />
        </Accordion.Title>
        <AccordionContent>
          {data && !isFetching && (
            <div className="flex flex-col gap-2">
              <TestPanelStats submission={data} />
              <div className="flex gap-4">
                <TestResultList tests={data.result.tests} />
                <div className="h-[40vh] w-1/2">
                  <CodeEditor
                    languages={getLanguageById(data.languageId)}
                    code={data.code}
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
