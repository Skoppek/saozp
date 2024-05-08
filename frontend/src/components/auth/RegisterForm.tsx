import { Button } from "flowbite-react/components/Button";
import { useCallback, useContext, useState } from "react";
import apiClient from "../../apiClient";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../pages/Root";
import { TextInput } from "../TextInput";
import { Spinner } from "flowbite-react/components/Spinner";

export const RegisterForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isWrongData, setIsWrongData] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  const handleRegister = useCallback(() => {
    if (
      !email.length ||
      !password.length ||
      !firstName.length ||
      !lastName.length
    ) {
      setIsWrongData(true);
      return;
    }
    setIsRegistering(true);
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
        setIsRegistering(false);
        authContext?.setIsLogged(false);
      });
  }, [authContext, email, firstName, lastName, navigate, password]);

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
      <Button type="submit" onClick={handleRegister}>
        {isRegistering ? (
          <Spinner aria-label="Register spinner" size="md" />
        ) : (
          "Zarejestruj się"
        )}
      </Button>
    </div>
  );
};
