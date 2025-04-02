import { Modal } from "flowbite-react/components/Modal";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import apiClient from "../../client/apiClient.ts";
import { ValidatedInput } from "../../components/inputs/ValidatedInput.tsx";

interface GroupCreateModalProps {
  show: boolean;
  onClose: () => void;
}

export const GroupCreateModal = ({ show, onClose }: GroupCreateModalProps) => {
  const [name, setName] = useState("");
  const [isValid, setValid] = useState(false);

  return (
    <Modal show={show} onClose={() => onClose()}>
      <Modal.Header>Tworzenie grupy</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <ValidatedInput 
            label={"Nazwa grupy"}
            onChange={setName}
            isValid={setValid}
            minLength={1}
            maxLength={128}
          />
          <Button
            color={"success"}
            disabled={!isValid}
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
