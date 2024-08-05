import { Modal } from "flowbite-react/components/Modal";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import apiClient from "../../client/apiClient.ts";
import { MarkdownEditor } from "../../components/markdown/MarkdownEditor.tsx";
import moment from "moment";
import { DateTimePicker } from "../../components/inputs/DateTimePicker.tsx";
import { TextInput } from "../../components/inputs/TextInput.tsx";

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
        <div className="flex flex-col gap-4">
          <TextInput
            id={"groupName"}
            label={"Nazwa zawodów"}
            onChange={(value) => setName(value)}
          />
          <MarkdownEditor
            onChange={(value) => setDescription(value)}
            label="Opis"
            rows={4}
          />
          <div className="flex gap-4">
            <DateTimePicker
              id="startDate"
              value={startDate}
              onChange={(value) => setStartDate(value)}
              label="Start"
            />
            <DateTimePicker
              id="endDate"
              value={endDate}
              onChange={(value) => setEndDate(value)}
              label="Koniec"
            />
          </div>
          <Button
            color={"success"}
            disabled={!name.length || moment(startDate).isSameOrAfter(endDate)}
            onClick={() => {
              apiClient.contests
                .create({ name, description, startDate, endDate })
                .then(() => onClose());
            }}
          >
            Stwórz
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
