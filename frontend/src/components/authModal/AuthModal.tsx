import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { useNavigate } from "react-router-dom";
import { User } from "../../shared/interfaces/User.ts";
import { Card } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { SignInModal } from "./SignInModal.tsx";
import { PasswordResetForm } from "./PasswordResetForm.tsx";
import { useToast } from "../../contexts/ToastContext/useToast.tsx";
import { SignUpModal } from "./SignUpModal.tsx";

type Mode = "signIn" | "signUp" | "reset";

const Header = ({ mode, onClose }: { mode: Mode; onClose: () => void }) => {
  return (
    <div className="flex justify-between align-middle">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {mode == "signIn"
          ? "Logowanie"
          : mode == "signUp"
            ? "Rejestracja"
            : "Odnawianie hasła"}
      </h5>
      <Button
        outline
        onClick={() => {
          onClose();
        }}
      >
        <HiX className="size-4" />
      </Button>
    </div>
  );
};

interface AuthModalProps {
  onLogin: (user?: User) => void;
  onClose: () => void;
}

interface Error {
  status: number;
}

const isError = (error: unknown): error is Error =>
  typeof error == "object" &&
  error != null &&
  "status" in error &&
  typeof error.status == "number";

export const AuthModal = ({ onLogin, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<Mode>("signIn");

  const navigate = useNavigate();
  const { showToast } = useToast();

  return (
    <div className="absolute right-3 z-50 m-8">
      <Card className="w-[400px]">
        <Header mode={mode} onClose={onClose} />
        {mode == "signIn" ? (
          <SignInModal
            onSuccess={() => {
              onLogin();
              onClose();
              navigate("/problems");
            }}
            onError={(error) => {
              if (isError(error)) {
                if (error.status == 418) {
                  showToast({
                    type: "warning",
                    content: "Wymagana zmiana hasła.",
                  });
                  setMode("reset");
                } else {
                  console.warn({ error });
                }
              }
              showToast({
                type: "failure",
                content: "Logowanie nie powiodło się.",
              });
            }}
          />
        ) : mode == "signUp" ? (
          <SignUpModal
            onSuccess={() => {
              setMode("signIn");
            }}
            onError={(error) => {
              if (isError(error)) {
                if (error.status == 409) {
                  showToast({
                    type: "failure",
                    content: "Ten login jest już zajęty.",
                  });
                } else {
                  showToast({
                    type: "failure",
                    content: "Rejestracja nie powiodła się.",
                  });
                  console.warn(error);
                }
              }
            }}
          />
        ) : (
          <PasswordResetForm
            onSuccess={() => {
              setMode("signIn");
            }}
          />
        )}
      </Card>
    </div>
  );
};
