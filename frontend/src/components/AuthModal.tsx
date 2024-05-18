import { Modal } from "flowbite-react/components/Modal";
import { useCallback, useMemo, useState } from "react";
import { TextInput } from "./TextInput";
import { Button } from "flowbite-react/components/Button";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { Spinner } from "flowbite-react/components/Spinner";
import { User } from "../shared/interfaces/User";

interface AuthModalProps {
  onLogin: (user?: User) => void;
  onClose: () => void;
  show: boolean;
  isLogin?: boolean;
}

export const AuthModal = ({
  onLogin,
  onClose,
  show,
  isLogin,
}: AuthModalProps) => {
  const [hasAccount, setHasAccount] = useState<boolean>(isLogin ?? false);
  const [email, setEmail] = useState<string>("");
  const [isEmailTaken, setIsEmailTaken] = useState<boolean>(false);
  const [isLoginFail, setIsLoginFail] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [showWarnings, setShowWarnings] = useState<boolean>(false);

  // Maybe looks awful but I dodn't have a better idea
  const resetStates = useCallback(() => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setIsEmailTaken(false);
    setIsLoginFail(false);
    setIsWaiting(false);
    setShowWarnings(false);
  }, []);

  const navigate = useNavigate();

  const isEmailCorrect = useMemo<boolean>(() => {
    return (
      email.length > 0 &&
      new RegExp(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/).test(email) &&
      !isEmailTaken &&
      !isLoginFail
    );
  }, [email, isEmailTaken, isLoginFail]);

  const isPasswordCorrect = useMemo<boolean>(() => {
    return password.length > 0 && !isLoginFail;
  }, [isLoginFail, password.length]);

  const isFirstNameCorrect = useMemo<boolean>(() => {
    return firstName.length > 0;
  }, [firstName.length]);

  const isLastNameCorrect = useMemo<boolean>(() => {
    return lastName.length > 0;
  }, [lastName.length]);

  const handleRegister = useCallback(() => {
    apiClient
      .registerUser({
        email,
        password,
        firstName,
        lastName,
      })
      .then(() => {
        setIsWaiting(false);
        setHasAccount(true);
      })
      .catch((error) => {
        if (error.response.status ?? error.response.status === 409)
          setIsEmailTaken(true);
        setIsWaiting(false);
      });
  }, [email, firstName, lastName, password]);

  const handleLogin = useCallback(() => {
    apiClient
      .loginUser({
        email,
        password,
      })
      .then(() => {
        onLogin();
        setIsWaiting(false);
        navigate("/problems");
        onClose();
      })
      .catch(() => {
        setIsLoginFail(true);
        setIsWaiting(false);
      });
  }, [email, navigate, onClose, onLogin, password]);

  const submit = useCallback(() => {
    if (
      !isEmailCorrect ||
      !isPasswordCorrect ||
      (!hasAccount && (!isFirstNameCorrect || !isLastNameCorrect))
    ) {
      setShowWarnings(true);
      return;
    }
    setIsWaiting(true);

    if (hasAccount) handleLogin();
    else handleRegister();
  }, [
    handleLogin,
    handleRegister,
    hasAccount,
    isEmailCorrect,
    isFirstNameCorrect,
    isLastNameCorrect,
    isPasswordCorrect,
  ]);

  return (
    <Modal
      show={show}
      onClose={() => {
        onClose();
        resetStates();
      }}
    >
      <Modal.Header>
        {hasAccount ? "Zaloguj się" : "Zarejestruj się"}
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <TextInput
            id={"email"}
            type="email"
            label="Email"
            placeholder="user@mail.com"
            color={showWarnings && !isEmailCorrect ? "failure" : "gray"}
            onChange={(value) => {
              setIsEmailTaken(false);
              setShowWarnings(false);
              setIsLoginFail(false);
              setEmail(value);
            }}
            helperText={
              <>
                {isEmailTaken && (
                  <span>Użytkownik z tym adresem już istnieje</span>
                )}
              </>
            }
          />
          <TextInput
            id={"password"}
            type="password"
            label="Hasło"
            color={showWarnings && !isPasswordCorrect ? "failure" : "gray"}
            onChange={(value) => {
              setShowWarnings(false);
              setIsLoginFail(false);
              setPassword(value);
            }}
          />
          {isLoginFail && (
            <span className="text-orange-700 dark:text-red-500">
              Niepoprawny email lub hasło
            </span>
          )}
          {!hasAccount && (
            <>
              <TextInput
                id={"name"}
                label="Imię"
                color={showWarnings && !isFirstNameCorrect ? "failure" : "gray"}
                onChange={(value) => {
                  setShowWarnings(false);
                  setFirstName(value);
                }}
              />
              <TextInput
                id={"lastname"}
                label="Nazwisko"
                color={showWarnings && !isLastNameCorrect ? "failure" : "gray"}
                onChange={(value) => {
                  setShowWarnings(false);
                  setLastName(value);
                }}
              />
            </>
          )}
          <Button type="submit" onClick={submit}>
            {isWaiting ? (
              <Spinner aria-label="Register spinner" size="md" />
            ) : hasAccount ? (
              "Zaloguj się"
            ) : (
              "Zarejestruj się"
            )}
          </Button>
          <Button
            onClick={() => {
              setShowWarnings(false);
              setHasAccount((prev) => !prev);
            }}
            color={"light"}
          >
            {hasAccount
              ? "Nie masz konta? Dołącz tutaj!"
              : "Masz już konto? Zaloguj się tutaj!"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
