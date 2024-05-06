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
        console.log(data);
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
          </div>{" "}
        </Accordion.Title>
        <AccordionContent>
          {details ? details.result.averageMemory : "kurde"}
        </AccordionContent>
      </Accordion.Panel>
    </Accordion>
  );
};
