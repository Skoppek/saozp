import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry";
import { Submission } from "../../shared/interfaces/Submission";
import { ResultPanel } from "./ResultPanel";
import moment from "moment";
import { Modal } from "flowbite-react/components/Modal";

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
          {submissions
            .sort((a, b) => (moment(a.createdAt).isBefore(b.createdAt) ? 1 : 0))
            .map((submission, key) => (
              <ResultPanel key={`submission${key}`} submission={submission} />
            ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};
