import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { useNavigate } from "react-router-dom";
import { User } from "../../shared/interfaces/User.ts";
import { Card } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { SignInModal } from "./SignInModal.tsx";
import { PasswordResetForm } from "./PasswordResetForm.tsx";

type Mode = "signIn" | "signUp" | "reset";

const Header = ({ mode, onClose }: { mode: Mode, onClose: () => void }) => {
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
  isLogin?: boolean;
}

export const AuthModal = ({ onLogin, onClose, isLogin }: AuthModalProps) => {
  const [mode, setMode] = useState<Mode>("signIn");

  const navigate = useNavigate();

  return (
    <div className="absolute right-3 z-50 m-8">
      <Card className="w-[400px]">
        <Header mode={mode} onClose={onClose} />
        {
          mode == "signIn" ? <SignInModal onSuccess={() => {

          }} onError={(error) => {

          }}/>
          : mode == "signUp" ? <SignUpModal onSuccess={() => {

          }} onError={(error) => {
            
          }}/>
          : <PasswordResetForm />
        }
      </Card>
    </div>
  );
};
