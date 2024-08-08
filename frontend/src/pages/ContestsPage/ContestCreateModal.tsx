import { Modal } from "flowbite-react/components/Modal";
import apiClient from "../../client/apiClient.ts";
import { ContestInfoForm } from "./ContestInfoForm.tsx";
import moment from "moment";

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
            startDate: moment().set("second", 0).toDate(),
            endDate: moment().set("second", 0).toDate(),
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
