import { useEffect, useState } from "react";
import { Credentials } from "../../shared/interfaces/Credentials";
import { ValidatedInput } from "../inputs/ValidatedInput";

export const CredentialsForm = ({
  setCredentials,
}: {
  setCredentials: (credentials: Credentials | null) => void;
}) => {
  const [login, setLogin] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    setCredentials(
      !!login && !!password
        ? {
            login,
            password,
          }
        : null,
    );
  }, [login, password, setCredentials]);

  return (
    <div className="flex flex-col gap-4">
      <ValidatedInput
        label="Login"
        onChange={setLogin}
        onError={() => setLogin(null)}
        maxLength={64}
        minLength={1}
      />
      <ValidatedInput
        label="Hasło"
        type="password"
        onChange={setPassword}
        onError={() => setPassword(null)}
        maxLength={32}
        minLength={1}
      />
    </div>
  );
};
