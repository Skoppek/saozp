import { useCallback, useContext, useEffect, useState } from "react";
import apiClient from "../../apiClient";
import { Button } from "flowbite-react/components/Button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../pages/Root";
import { TextInput } from "../TextInput";
import { Spinner } from "flowbite-react/components/Spinner";
import { Popover } from "flowbite-react";

export const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isWrongCredentials, setIsWrongCredentials] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext?.isLogged) {
      navigate("/problems");
    }
  }, [authContext, navigate]);

  const handleLogin = useCallback(() => {
    if (!email.length || !password.length) {
      setIsWrongCredentials(true);
      return;
    }
    setIsLoggingIn(true);
    apiClient
      .loginUser({
        email,
        password,
      })
      .then(() => {
        authContext?.setIsLogged(true);
        navigate("/problems");
      })
      .catch(() => {
        setIsLoggingIn(false);
        authContext?.setIsLogged(false);
        setIsWrongCredentials(true);
      });
  }, [authContext, email, navigate, password]);

  return (
    <div className="flex w-96 max-w-md flex-col gap-4">
      <TextInput
        id={"email"}
        type="email"
        label="Email"
        placeholder="user@mail.com"
        onChange={(value) => {
          setIsWrongCredentials(false);
          setEmail(value);
        }}
      />
      <TextInput
        id={"password"}
        type="password"
        label="Hasło"
        onChange={(value) => {
          setIsWrongCredentials(false);
          setPassword(value);
        }}
      />
      <Popover
        content={<div className="m-4">Email lub hasło są niepoprawne</div>}
        open={isWrongCredentials}
      >
        <Button type="submit" onClick={handleLogin} disabled={isLoggingIn}>
          {isLoggingIn ? (
            <Spinner aria-label="Extra large spinner" size="md" />
          ) : (
            "Zaloguj się"
          )}
        </Button>
      </Popover>
    </div>
  );
};
