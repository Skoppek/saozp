import { Modal } from "flowbite-react/components/Modal";
import { useCallback, useMemo, useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react/components/Spinner";
import { User } from "../shared/interfaces/User";
import apiClient from "../client/apiClient.ts";
import { StatusCodes } from "http-status-codes";
import { Tooltip } from "flowbite-react";
import { TextInput } from "./inputs/TextInput.tsx";

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
  const [token, setToken] = useState<string>("");

  // Maybe looks awful, but I don't have a better idea
  const resetStates = useCallback(() => {
    setLogin("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setToken("");
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
        if (res.error) throw res.error;
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
        <div className="flex flex-col gap-4">
          {isPasswordReset ? (
            <>
              <div className="flex gap-4">
                <TextInput
                  id={"password-token-login"}
                  type={"text"}
                  label={"Login"}
                  color={showWarnings ? "failure" : "gray"}
                  helperText={showWarnings ? "Niepoprawny login" : undefined}
                  onChange={(value) => setLogin(value)}
                />
                <Tooltip
                  content={
                    "W razie braku tokena zmiany hasła zgłoś się po nowy do administratora."
                  }
                  style={"light"}
                  placement={"right-start"}
                >
                  <TextInput
                    id={"password-token"}
                    type={"text"}
                    label={"Token zmiany hasła"}
                    color={showWarnings ? "failure" : "gray"}
                    helperText={showWarnings ? "Błędny token" : undefined}
                    onChange={(value) => setToken(value)}
                  />
                </Tooltip>
              </div>
              <TextInput
                id={"new-password"}
                type={"password"}
                label={"Nowe hasło"}
                onChange={(value) => setPassword(value)}
              />
              <Button
                onClick={async () => {
                  await apiClient.auth
                    .changePassword(token, password, login)
                    .then((response) => {
                      if (response.error) throw response.error;
                      resetStates();
                    })
                    .catch((error) => {
                      switch (error.status) {
                        case StatusCodes.NOT_FOUND: {
                          setShowWarnings(true);
                        }
                      }
                    });
                }}
              >
                Ustaw nowe hasło
              </Button>
            </>
          ) : (
            <>
              <TextInput
                id={"login"}
                type="text"
                label="Login"
                color={showWarnings && !isEmailCorrect ? "failure" : "gray"}
                onChange={(value) => {
                  setIsLoginTaken(false);
                  setShowWarnings(false);
                  setIsLoginFail(false);
                  setLogin(value);
                }}
                helperText={
                  <>
                    {isLoginTaken && (
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
                    color={
                      showWarnings && !isFirstNameCorrect ? "failure" : "gray"
                    }
                    onChange={(value) => {
                      setShowWarnings(false);
                      setFirstName(value);
                    }}
                  />
                  <TextInput
                    id={"lastname"}
                    label="Nazwisko"
                    color={
                      showWarnings && !isLastNameCorrect ? "failure" : "gray"
                    }
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
      </Modal.Body>
    </Modal>
  );
};
