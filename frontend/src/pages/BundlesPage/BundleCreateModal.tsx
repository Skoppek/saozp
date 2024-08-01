import { Modal } from "flowbite-react/components/Modal";
import { TextInput } from "../../components/TextInput.tsx";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import apiClient from "../../client/apiClient.ts";

interface BundleCreateModalProps {
  show: boolean;
  onClose: () => void;
}

export const BundleCreateModal = ({
  show,
  onClose,
}: BundleCreateModalProps) => {
  const [name, setName] = useState("");

  return (
    <Modal show={show} onClose={() => onClose()}>
      <Modal.Header>Tworzenie paczki</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <TextInput
            id={"bundleName"}
            label={"Nazwa paczki"}
            onChange={(value) => setName(value)}
          />
          <Button
            color={"success"}
            disabled={!name.length}
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
