import { useContext, useEffect, useState } from "react";
import apiClient from "../../apiClient";
import { Button } from "flowbite-react/components/Button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../pages/Root";
import { TextInput } from "../TextInput";
import { Spinner } from "flowbite-react/components/Spinner";

export const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isWrongCredentials, setIsWrongCredentials] = useState<boolean>();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext?.isLogged) {
      navigate("/problems");
    }
  }, [authContext, navigate]);

  return (
    <div className="flex w-96 max-w-md flex-col gap-4">
      <TextInput
        id={"email"}
        type="email"
        label="Email"
        placeholder="user@mail.com"
        color={isWrongCredentials ? "failure" : "gray"}
        onChange={(value) => {
          setIsWrongCredentials(false);
          setEmail(value);
        }}
      />
      <TextInput
        id={"password"}
        type="password"
        label="Hasło"
        color={isWrongCredentials ? "failure" : "gray"}
        onChange={(value) => {
          setIsWrongCredentials(false);
          setPassword(value);
        }}
      />
      <Button
        type="submit"
        onClick={() => {
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
            .catch((error) => {
              setIsLoggingIn(false);
              authContext?.setIsLogged(false);
              if (error.response.status && error.response.status == 401) {
                setIsWrongCredentials(true);
              }
            });
        }}
      >
        {isLoggingIn ? (
          <Spinner aria-label="Extra large spinner" size="xl" />
        ) : (
          "Zaloguj się"
        )}
      </Button>
    </div>
  );
};
