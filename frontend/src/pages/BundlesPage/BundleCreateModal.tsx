import { Modal } from "flowbite-react/components/Modal";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import apiClient from "../../client/apiClient.ts";
import { ValidatedInput } from "../../components/inputs/ValidatedInput.tsx";

interface BundleCreateModalProps {
  show: boolean;
  onClose: () => void;
}

export const BundleCreateModal = ({
  show,
  onClose,
}: BundleCreateModalProps) => {
  const [name, setName] = useState("");
  const [isValid, setValid] = useState(false);

  return (
    <Modal show={show} onClose={() => onClose()}>
      <Modal.Header>Tworzenie paczki</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <ValidatedInput
            label="Nazwa paczki"
            onChange={setName}
            isValid={setValid}
            minLength={1}
            maxLength={128}
          />
          <Button
            color={"success"}
            disabled={!isValid}
            onClick={() => {
              apiClient.bundles.create({ name: name }).then(() => onClose());
            }}
          >
            Stwórz
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
