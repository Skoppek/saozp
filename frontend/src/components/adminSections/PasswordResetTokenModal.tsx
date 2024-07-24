import { Modal } from "flowbite-react/components/Modal";

interface PasswordResetTokenModalProps {
  isShown: boolean;
  onClose: () => void;
  token: string;
}

export const PasswordResetTokenModal = ({
  isShown,
  onClose,
  token,
}: PasswordResetTokenModalProps) => {
  return (
    <Modal show={isShown} onClose={() => onClose()}>
      <Modal.Header>Stworzono token odnowienia hasła.</Modal.Header>
      <Modal.Body>
        <div className="flex w-full flex-col gap-2">
          <div
            className={"text-center text-5xl text-black dark:text-slate-100"}
          >
            {token}
          </div>
          <div className={"text-center text-gray-500 dark:text-gray-400"}>
            Przekaż lub wyślij powyższy token użytkownikowi, któremu odnawiasz
            hasło.
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
