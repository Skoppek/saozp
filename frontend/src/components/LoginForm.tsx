import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";
// import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const LoginForm = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [isWrongCredentials, setIsWrongCredentials] = useState<boolean>();
  // const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["session"]);

  useEffect(() => {
    console.log(cookies);
  }, [cookies]);

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
              email: "email1@gmail.com",
              password: "password1",
            })
            .then(() => {
              console.log(cookies);
              //   navigate("/me");
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
