import { Modal } from "flowbite-react/components/Modal";
import { TextInput } from "../../components/TextInput.tsx";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import apiClient from "../../client/apiClient.ts";

interface GroupCreateModalProps {
  show: boolean;
  onClose: () => void;
}

export const GroupCreateModal = ({ show, onClose }: GroupCreateModalProps) => {
  const [name, setName] = useState("");

  return (
    <Modal show={show} onClose={() => onClose()}>
      <Modal.Header>Tworzenie grupy</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <TextInput
            id={"groupName"}
            label={"Nazwa grupy"}
            onChange={(value) => setName(value)}
          />
          <Button
            color={"success"}
            disabled={!name.length}
            onClick={() => {
              apiClient.groups.create({ name: name }).then(() => onClose());
            }}
          >
            Stwórz
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
