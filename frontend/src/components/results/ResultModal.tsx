import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry";
import { Submission } from "../../shared/interfaces/Submission";
import { ResultPanel } from "./ResultPanel";
import { Modal } from "flowbite-react/components/Modal";
import _ from "lodash";

interface ResultsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  submissions: SubmissionEntry[];
  onCheckCode: (submission: Submission) => void;
}

export const ResultsModal = ({
  isOpen,
  setIsOpen,
  submissions,
}: ResultsModalProps) => {
  return (
    <Modal
      show={isOpen}
      onClose={() => setIsOpen(false)}
      title="Wyniki"
      size={"7xl"}
    >
      <Modal.Header>Wyniki</Modal.Header>
      <Modal.Body>
        <div className="mx-4 flex flex-col gap-2">
          {_.chain(submissions)
            .sortBy("createdAt")
            .reverse()
            .map((submission, key) => (
              <ResultPanel key={`submission${key}`} submission={submission} />
            ))
            .value()}
        </div>
      </Modal.Body>
    </Modal>
  );
};
