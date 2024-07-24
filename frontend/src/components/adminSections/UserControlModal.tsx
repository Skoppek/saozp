import { Button, Modal } from "flowbite-react";
import apiClient from "../../client/apiClient.ts";
import { UserAdminData } from "../../shared/interfaces/UserAdminData.ts";
import { useState } from "react";
import { PasswordResetControl } from "./PasswordResetControl.tsx";

interface UserControlModalProps {
  isShown: boolean;
  close: () => void;
  onClose: () => void;
  selectedUser?: UserAdminData;
}

export const UserControlModal = ({
  isShown,
  close,
  onClose,
  selectedUser,
}: UserControlModalProps) => {
  const [errorMsg, setErrorMsg] = useState<string | undefined>();

  return (
    <Modal show={isShown} onClose={() => onClose()}>
      <Modal.Header>Kontrola użytkownika</Modal.Header>
      <Modal.Body>
        {selectedUser && (
          <div className="flex flex-col gap-2">
            {selectedUser.sessionId && (
              <Button
                onClick={() => {
                  if (selectedUser.sessionId) {
                    apiClient.admin
                      .logoutUser(selectedUser.sessionId)
                      .then(() => {
                        onClose();
                        close();
                      })
                      .catch((error) => {
                        if (error.response.status === 400) {
                          setErrorMsg(
                            "Nie możesz zakończyć swojej sesji. Aby to zrobić, wyloguj się.",
                          );
                          setTimeout(() => setErrorMsg(undefined), 5000);
                        }
                      });
                  }
                }}
              >
                Zakończ sesję
              </Button>
            )}
            <Button
              onClick={() => {
                if (selectedUser.isAdmin) {
                  apiClient.admin
                    .demote(selectedUser.userId)
                    .then(() => {
                      onClose();
                      close();
                    })
                    .catch((error) => {
                      if (error.response.status === 400) {
                        setErrorMsg(
                          "Nie możesz odebrać sobie roli administratora.",
                        );
                        setTimeout(() => setErrorMsg(undefined), 5000);
                      }
                    });
                } else {
                  apiClient.admin.promote(selectedUser.userId).then(() => {
                    onClose();
                    close();
                  });
                }
              }}
            >
              {selectedUser.isAdmin ? "Odbierz" : "Nadaj"} rolę administratora
            </Button>
            <PasswordResetControl
              userId={selectedUser.userId}
              onClose={() => {
                onClose();
                close();
              }}
            />
            {errorMsg && (
              <div className="text-base text-rose-500">{errorMsg}</div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
