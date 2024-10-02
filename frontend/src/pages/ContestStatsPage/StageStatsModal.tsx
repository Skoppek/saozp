import { useQuery } from "@tanstack/react-query";
import { Accordion, Badge, Modal } from "flowbite-react";
import apiClient from "../../client/apiClient";
import { useContestContext } from "../../shared/useContestContext";
import { getLanguageById } from "../../shared/constansts";
import { useCallback } from "react";
import { LastSubmissionView } from "./LastSubmissionView";

interface StageStatsModalProps {
  show: boolean;
  onClose: () => void;
  stageId: number;
  stageName: string;
  participantId: number;
}

export const StageStatsModal = ({
  show,
  onClose,
  stageId,
  stageName,
  participantId,
}: StageStatsModalProps) => {
  const { id: contestId } = useContestContext();

  const { data: stage } = useQuery({
    queryKey: ["stage", stageId, "stats", "participant", participantId],
    queryFn: () =>
      apiClient.contests.getStatsForStage(contestId, stageId, participantId),
  });

  const color = useCallback((value: number) => {
    if (value < 0) return "grey";
    if (value < 10) return "failure";
    if (value < 30) return "warning";
    if (value < 75) return "light";
    if (value < 100) return "blue";
    return "success";
  }, []);

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>{stageName}</Modal.Header>
      <Modal.Body>
        {stage && (
          <Accordion collapseAll>
            {stage.map((problem) => (
              <Accordion.Panel>
                <Accordion.Title>
                  <div className="flex gap-4">
                    <div>{problem.problem?.name}</div>
                    <Badge>
                      {getLanguageById(problem.problem?.languageId).name}
                    </Badge>
                    <Badge color={color(problem.result)}>
                      {problem.result > 0 ? `${problem.result}%` : "N/A"}
                    </Badge>
                  </div>
                </Accordion.Title>
                <Accordion.Content>
                  {problem.submissionId ? (
                    <LastSubmissionView submissionId={problem.submissionId} />
                  ) : (
                    <Badge size={"sm"} color={"warning"}>
                      Brak zgłoszeń
                    </Badge>
                  )}
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
        )}
      </Modal.Body>
    </Modal>
  );
};
