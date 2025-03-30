import { useCallback, useState } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import apiClient from "../../client/apiClient";
import { Credentials } from "../../shared/interfaces/Credentials";
import { CredentialsForm } from "./CredentialsForm";
import { Button } from "flowbite-react/components/Button";
import { Spinner } from "flowbite-react/components/Spinner";

interface SignInModalInterface {
  onSuccess: () => void;
  onError: (error: unknown) => void;
}

export const SignInModal = ({ onSuccess, onError }: SignInModalInterface) => {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isWaiting, setWaiting] = useState(false);

  const signIn = useCallback(() => {
    setWaiting(true);
    if (!credentials) {
      setWaiting(false);
      throw Error("Sending null credentials on sign-in.")
    };
    apiClient.auth
      .signIn(credentials)
      .then((res) => {
        if (res?.error) throw res.error;
        onSuccess();
      })
      .catch((error) => {
        setWaiting(false);
        onError(error)
      });
  }, [credentials, onError, onSuccess]);

  return (
    <KeyboardEventHandler
      handleKeys={["enter"]}
      handleEventType="keydown"
      onKeyEvent={signIn}
    >
      <div className="flex flex-col gap-6">
        <CredentialsForm setCredentials={setCredentials} />
        <Button type="submit" onClick={signIn} disabled={isWaiting || !credentials}>
          {isWaiting ? (
            <Spinner aria-label="spinner" size="md" />
          ) : (
            "Zaloguj się"
          )}
        </Button>
      </div>
    </KeyboardEventHandler>
  );
};
