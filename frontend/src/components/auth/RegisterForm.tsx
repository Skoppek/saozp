import { Button } from "flowbite-react/components/Button";
import { useContext, useState } from "react";
import apiClient from "../../apiClient";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../pages/Root";
import { TextInput } from "../TextInput";

export const RegisterForm = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [isWrongData, setIsWrongData] = useState<boolean>(false);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  return (
    <div className="mx-auto my-[80px] flex w-96 flex-col gap-4">
      <TextInput
        id={"email"}
        type="email"
        label="Email"
        placeholder="user@mail.com"
        color={isWrongData ? "failure" : "gray"}
        onChange={(value) => {
          setIsWrongData(false);
          setEmail(value);
        }}
      />
      <TextInput
        id={"password"}
        type="password"
        label="Hasło"
        color={isWrongData ? "failure" : "gray"}
        onChange={(value) => {
          setIsWrongData(false);
          setPassword(value);
        }}
      />
      <TextInput
        id={"name"}
        label="Imię"
        color={isWrongData ? "failure" : "gray"}
        onChange={(value) => {
          setIsWrongData(false);
          setFirstName(value);
        }}
      />
      <TextInput
        id={"lastname"}
        label="Nazwisko"
        color={isWrongData ? "failure" : "gray"}
        onChange={(value) => {
          setIsWrongData(false);
          setLastName(value);
        }}
      />
      <Button
        type="submit"
        onClick={() => {
          if (!email || !password || !firstName || !lastName) {
            setIsWrongData(true);
            return;
          }
          apiClient
            .registerUser({
              email,
              password,
              firstName,
              lastName,
            })
            .then(() => {
              authContext?.setIsLogged(true);
              navigate("/problems");
            })
            .catch(() => {
              authContext?.setIsLogged(false);
            });
        }}
      >
        Zarejestruj się
      </Button>
    </div>
  );
};
