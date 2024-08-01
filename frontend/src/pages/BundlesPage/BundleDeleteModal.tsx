import { Modal } from "flowbite-react/components/Modal";
import { Button } from "flowbite-react/components/Button";
import apiClient from "../../client/apiClient.ts";

interface BundleDeleteModalProps {
  bundle: {
    name: string;
    id: number;
  };
  show: boolean;
  onClose: () => void;
}

export const BundleDeleteModal = ({
  bundle,
  show,
  onClose,
}: BundleDeleteModalProps) => {
  return (
    <Modal show={show} onClose={() => onClose()}>
      <Modal.Header>Czy na pewno chcesz usunąć paczkę?</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <div
            className={"text-center text-3xl text-black dark:text-slate-100"}
          >
            {bundle.name}
          </div>
          <Button
            color={"failure"}
            onClick={() => {
              void apiClient.bundles.remove(bundle.id);
              onClose();
            }}
          >
            Usuń
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
