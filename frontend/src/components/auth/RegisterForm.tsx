import { Button } from "flowbite-react/components/Button";
import { useCallback, useContext, useEffect, useState } from "react";
import apiClient from "../../apiClient";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../pages/Root";
import { TextInput } from "../TextInput";
import {
  USER_EMAIL_LENGTH_LIMIT,
  USER_FIRST_NAME_LENGTH_LIMIT,
  USER_LAST_NAME_LENGTH_LIMIT,
} from "../../shared/constansts";

export const RegisterForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isWrongData, setIsWrongData] = useState<boolean>(false);
  const [isEmailCorrect, setIsEmailCorrect] = useState<boolean>(true);
  const [isFirstNameCorrect, setIsFirstNameCorrect] = useState<boolean>(true);
  const [isLastNameCorrect, setIsLastNameCorrect] = useState<boolean>(true);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  const checkFields = useCallback(() => {
    setIsFirstNameCorrect(
      firstName?.length <= USER_FIRST_NAME_LENGTH_LIMIT &&
        firstName?.length >= 3,
    );
    setIsLastNameCorrect(
      lastName?.length <= USER_LAST_NAME_LENGTH_LIMIT && lastName?.length >= 3,
    );
  }, [firstName?.length, lastName?.length]);

  return (
    <div className="flex w-96 max-w-md flex-col gap-4">
      <TextInput
        id={"email"}
        type="email"
        label="Email"
        placeholder="user@mail.com"
        color={isWrongData ? "failure" : "gray"}
        onChange={(value) => {
          setIsWrongData(false);
          setEmail(value);
          checkFields();
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
          checkFields();
        }}
      />
      <TextInput
        id={"name"}
        label="Imię"
        color={isFirstNameCorrect ? "gray" : "failure"}
        onChange={(value) => {
          setIsWrongData(false);
          setFirstName(value);
          checkFields();
        }}
      />
      <TextInput
        id={"lastname"}
        label="Nazwisko"
        color={isLastNameCorrect ? "gray" : "failure"}
        onChange={(value) => {
          setIsWrongData(false);
          setLastName(value);
          checkFields();
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
