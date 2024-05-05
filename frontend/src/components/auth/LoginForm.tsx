import { useContext, useEffect, useState } from "react";
import apiClient from "../../apiClient";
// import { TextInput } from "flowbite-react/components/TextInput";
import { Label } from "flowbite-react/components/Label";
import { Button } from "flowbite-react/components/Button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../pages/Root";
import { TextInput } from "../TextInput";

export const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isWrongCredentials, setIsWrongCredentials] = useState<boolean>();
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext?.isLogged) {
      navigate("me");
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
          apiClient
            .loginUser({
              email,
              password,
            })
            .then(() => {
              authContext?.setIsLogged(true);
              navigate("/me");
            })
            .catch((error) => {
              authContext?.setIsLogged(false);
              if (error.response.status && error.response.status == 401) {
                setIsWrongCredentials(true);
              }
            });
        }}
      >
        Zaloguj się
      </Button>
    </div>
  );
};
