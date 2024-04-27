import { useState } from "react";
import apiClient from "../apiClient";
import { TextInput } from "flowbite-react/components/TextInput";
import { Label } from "flowbite-react/components/Label";
import { Button } from "flowbite-react/components/Button";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isWrongCredentials, setIsWrongCredentials] = useState<boolean>();
  const navigate = useNavigate();

  return (
    <div className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Email" />
        </div>
        <TextInput
          id="email"
          type="email"
          placeholder="mail@domain.com"
          required
          color={isWrongCredentials ? "failure" : "gray"}
          onChange={(event) => {
            setIsWrongCredentials(false);
            setEmail(event.target.value);
          }}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Hasło" />
        </div>
        <TextInput
          id="password"
          type="password"
          required
          color={isWrongCredentials ? "failure" : "gray"}
          onChange={(event) => {
            setIsWrongCredentials(false);
            setPassword(event.target.value);
          }}
        />
      </div>
      <Button
        type="submit"
        onClick={() => {
          apiClient
            .loginUser({
              email,
              password,
            })
            .then(() => {
              navigate("/me");
            })
            .catch((error) => {
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
