import { PasswordResetTokenModal } from "./PasswordResetTokenModal.tsx";
import { Button } from "flowbite-react";
import apiClient from "../../../client/apiClient.ts";
import { useState } from "react";
import { UserAdminData } from "../../../shared/interfaces/UserAdminData.ts";

interface PasswordResetControlProps {
  user: UserAdminData;
  onClose: () => void;
}

export const PasswordResetControl = ({
  user,
  onClose,
}: PasswordResetControlProps) => {
  const [token, setToken] = useState("");

  return (
    <>
      <PasswordResetTokenModal
        isShown={!!token}
        onClose={() => onClose()}
        token={token}
        userFullName={[user.firstName, user.lastName].join(" ")}
      />
      <Button
        onClick={() => {
          apiClient.admin.resetPassword(user.userId).then((response) => {
            setToken(response.token);
          });
        }}
      >
        Odnów hasło
      </Button>
    </>
  );
};
