import { Modal } from "flowbite-react/components/Modal";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import apiClient from "../../client/apiClient.ts";
import { MarkdownEditor } from "../../components/markdown/MarkdownEditor.tsx";
import moment from "moment";
import { DateTimePicker } from "../../components/inputs/DateTimePicker.tsx";
import { TextInput } from "../../components/inputs/TextInput.tsx";
import { ContestInfoForm } from "./ContestInfoForm.tsx";

interface ContestCreateModalProps {
  show: boolean;
  onClose: () => void;
}

export const ContestCreateModal = ({
  show,
  onClose,
}: ContestCreateModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(
    moment().set("second", 0).toDate(),
  );
  const [endDate, setEndDate] = useState(moment().set("second", 0).toDate());

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
          onSubmit={() =>
            apiClient.contests
              .create({ name, description, startDate, endDate })
              .then(() => onClose())
          }
          submitLabel={"Stwórz"}
        />
      </Modal.Body>
    </Modal>
  );
};
