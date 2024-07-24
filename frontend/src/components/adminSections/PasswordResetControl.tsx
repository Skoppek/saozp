import { PasswordResetTokenModal } from "./PasswordResetTokenModal.tsx";
import { Button } from "flowbite-react";
import apiClient from "../../client/apiClient.ts";
import { useState } from "react";

interface PasswordResetControlProps {
  userId: number;
  onClose: () => void;
}

export const PasswordResetControl = ({
  userId,
  onClose,
}: PasswordResetControlProps) => {
  const [token, setToken] = useState("");

  return (
    <>
      <PasswordResetTokenModal
        isShown={!!token}
        onClose={() => onClose()}
        token={token}
      />
      <Button
        onClick={() => {
          apiClient.admin.resetPassword(userId).then((response) => {
            setToken(response.token);
          });
        }}
      >
        Odnów hasło
      </Button>
    </>
  );
};
