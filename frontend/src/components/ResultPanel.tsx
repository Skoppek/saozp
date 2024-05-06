import {
  Accordion,
  AccordionContent,
} from "flowbite-react/components/Accordion";
import { Submission, SubmissionEntry } from "../shared/interfaces";
import { Badge } from "flowbite-react/components/Badge";
import { STATUS_NAMES } from "../shared/enums";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";

interface ResultPanelProps {
  submission: SubmissionEntry;
}

export const ResultPanel = ({ submission }: ResultPanelProps) => {
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
        <Accordion.Title>
          <div className="flex gap-8">
            {submission.createdAt ?? ""}
            <Badge size={"sm"}>
              {STATUS_NAMES[submission.status?.id ?? 0]}
            </Badge>
          </div>
        </Accordion.Title>
        <AccordionContent>
          {details && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-4">
                <Badge className="w-fit">{`Średnia pamięć: ${(details?.result.averageMemory / 1024).toFixed(2)} MB`}</Badge>
                <Badge className="w-fit">{`Średni czas: ${(details?.result.averageTime * 1000).toFixed(0)} ms`}</Badge>
              </div>
              <div className="flex flex-col gap-1">
                {details.result.tests
                  .filter((test) => test.statusId === 4)
                  .map((test) => (
                    <div className="flex gap-2 rounded-md bg-sky-500/20 p-2 dark:bg-sky-950">
                      <div>{`Wejście: ${test.input}`}</div>
                      <div>{`Otrzymano: ${test.received}`}</div>
                      <div>{`Oczekiwano: ${test.expected}`}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </AccordionContent>
      </Accordion.Panel>
    </Accordion>
  );
};
