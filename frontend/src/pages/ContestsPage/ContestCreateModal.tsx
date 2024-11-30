import { Modal } from "flowbite-react/components/Modal";
import apiClient from "../../client/apiClient.ts";
import { ContestInfoForm } from "./ContestInfoForm.tsx";

interface ContestCreateModalProps {
  show: boolean;
  onClose: () => void;
}

export const ContestCreateModal = ({
  show,
  onClose,
}: ContestCreateModalProps) => {
  return (
    <Modal show={show} onClose={() => onClose()}>
      <Modal.Header>Tworzenie zawodów</Modal.Header>
      <Modal.Body>
        <ContestInfoForm
          defaultData={{
            name: "",
            description: "",
          }}
          onSubmit={(data) =>
            apiClient.contests.create(data).then(() => onClose())
          }
          submitLabel={"Stwórz"}
        />
      </Modal.Body>
    </Modal>
  );
};
