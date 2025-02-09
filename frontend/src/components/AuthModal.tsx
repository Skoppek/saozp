import { Modal } from "flowbite-react/components/Modal";
import { useCallback, useMemo, useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react/components/Spinner";
import { User } from "../shared/interfaces/User";
import apiClient from "../client/apiClient.ts";
import { StatusCodes } from "http-status-codes";
import { FloatingLabel } from "flowbite-react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { PasswordResetForm } from "./PasswordResetForm.tsx";

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
  const [login, setLogin] = useState<string>("");
  const [isLoginTaken, setIsLoginTaken] = useState<boolean>(false);
  const [isLoginFail, setIsLoginFail] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [showWarnings, setShowWarnings] = useState<boolean>(false);
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);

  // Maybe looks awful, but I don't have a better idea
  const resetStates = useCallback(() => {
    setLogin("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setIsLoginTaken(false);
    setIsLoginFail(false);
    setIsWaiting(false);
    setShowWarnings(false);
    setIsPasswordReset(false);
  }, []);

  const navigate = useNavigate();

  const isEmailCorrect = useMemo<boolean>(() => {
    return login.length > 0 && !isLoginTaken && !isLoginFail;
  }, [login, isLoginTaken, isLoginFail]);

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
    apiClient.auth
      .signUp({
        login: login,
        password,
        firstName,
        lastName,
      })
      .then((res) => {
        if (res.error) throw res.error;
        setIsWaiting(false);
        setHasAccount(true);
      })
      .catch((error) => {
        if (error.status ?? error.status === StatusCodes.CONFLICT)
          setIsLoginTaken(true);
        setIsWaiting(false);
      });
  }, [login, firstName, lastName, password]);

  const handleLogin = useCallback(() => {
    apiClient.auth
      .signIn({
        login: login,
        password,
      })
      .then((res) => {
        if (res?.error) throw res.error;
        onLogin();
        setIsWaiting(false);
        navigate("/problems");
        onClose();
      })
      .catch((error) => {
        switch (error.status) {
          case StatusCodes.IM_A_TEAPOT: {
            setIsPasswordReset(true);
            break;
          }
          default: {
            setIsLoginFail(true);
            setIsWaiting(false);
          }
        }
      });
  }, [login, navigate, onClose, onLogin, password]);

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
        {isPasswordReset
          ? "Zmiana hasła"
          : hasAccount
            ? "Zaloguj się"
            : "Zarejestruj się"}
      </Modal.Header>
      <Modal.Body>
        <KeyboardEventHandler
          handleKeys={["enter"]}
          handleEventType="keydown"
          onKeyEvent={submit}
        >
          <div className="flex flex-col gap-4">
            {isPasswordReset ? (
              <PasswordResetForm />
            ) : (
              <>
                <FloatingLabel
                  variant="outlined"
                  label="Login"
                  color={showWarnings && !isEmailCorrect ? "error" : "default"}
                  onChange={(event) => {
                    setIsLoginTaken(false);
                    setShowWarnings(false);
                    setIsLoginFail(false);
                    setLogin(event.target.value);
                  }}
                  helperText={
                    isLoginTaken ? "Użytkownik z tym adresem już istnieje" : undefined
                  }
                  maxLength={64}
                />
                <FloatingLabel
                  variant="outlined"
                  type="password"
                  label="Hasło"
                  color={
                    showWarnings && !isPasswordCorrect ? "error" : "default"
                  }
                  onChange={(event) => {
                    setShowWarnings(false);
                    setIsLoginFail(false);
                    setPassword(event.target.value);
                  }}
                  maxLength={32}
                />
                {isLoginFail && (
                  <span className="text-orange-700 dark:text-red-500">
                    Niepoprawny email lub hasło
                  </span>
                )}
                {!hasAccount && (
                  <>
                    <FloatingLabel
                      variant="outlined"
                      label="Imię"
                      color={
                        showWarnings && !isFirstNameCorrect
                          ? "error"
                          : "default"
                      }
                      onChange={(event) => {
                        setShowWarnings(false);
                        setFirstName(event.target.value);
                      }}
                      maxLength={32}
                    />
                    <FloatingLabel
                      variant="outlined"
                      label="Nazwisko"
                      color={
                        showWarnings && !isLastNameCorrect ? "error" : "default"
                      }
                      onChange={(event) => {
                        setShowWarnings(false);
                        setLastName(event.target.value);
                      }}
                      maxLength={32}
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
                {hasAccount && (
                  <Button onClick={() => setIsPasswordReset(true)}>
                    Zmień hasło
                  </Button>
                )}
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
              </>
            )}
          </div>
        </KeyboardEventHandler>
      </Modal.Body>
    </Modal>
  );
};
