import { Button } from "flowbite-react/components/Button";
import { Label } from "flowbite-react/components/Label";
import { TextInput } from "flowbite-react/components/TextInput";
import { useState } from "react";
import apiClient from "../apiClient";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [isWrongData, setIsWrongData] = useState<boolean>(false);
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
          color={isWrongData ? "failure" : "gray"}
          onChange={(event) => {
            setIsWrongData(false);
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
          color={isWrongData ? "failure" : "gray"}
          onChange={(event) => {
            setIsWrongData(false);
            setPassword(event.target.value);
          }}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="name" value="Imię" />
        </div>
        <TextInput
          id="name"
          type="text"
          required
          color={isWrongData ? "failure" : "gray"}
          onChange={(event) => {
            setIsWrongData(false);

            setFirstName(event.target.value);
            if (!firstName) {
            }
          }}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="surname" value="Nazwisko" />
        </div>
        <TextInput
          id="surname"
          type="text"
          required
          color={isWrongData ? "failure" : "gray"}
          onChange={(event) => {
            setIsWrongData(false);
            setLastName(event.target.value);
          }}
        />
      </div>
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
              apiClient.getUserOfCurrentSession().then((response) => {
                console.log(response.data);
              });
            })
            .catch((error) => {
              if (error.response.status && error.response.status) {
                console.log(error.response);
              }
            });
        }}
      >
        Zarejestruj się
      </Button>
    </div>
  );
};
