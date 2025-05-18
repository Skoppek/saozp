import { useCallback, useState } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import apiClient from "../../client/apiClient";
import { Credentials } from "../../shared/interfaces/Credentials";
import { CredentialsForm } from "./CredentialsForm";
import { Button } from "flowbite-react/components/Button";
import { Spinner } from "flowbite-react/components/Spinner";
import { Profile } from "../../shared/interfaces/Profile";
import { ProfileForm } from "./ProfileForm";

interface SignUpModalInterface {
  onSuccess: () => void;
  onError: (error: unknown) => void;
}

export const SignUpModal = ({ onSuccess, onError }: SignUpModalInterface) => {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isWaiting, setWaiting] = useState(false);

  const signUp = useCallback(() => {
    setWaiting(true);
    if (!credentials) throw Error("Sending null credentials on sign-up.");
    if (!profile) throw Error("Sending null profile on sign-up.");
    apiClient.auth
      .signUp({
        ...credentials,
        ...profile,
      })
      .then((res) => {
        if (res?.error) throw res.error;
        onSuccess();
      })
      .catch(onError)
      .finally(() => setWaiting(false));
  }, [credentials, onError, onSuccess, profile]);

  return (
    <KeyboardEventHandler
      handleKeys={["enter"]}
      handleEventType="keydown"
      onKeyEvent={signUp}
    >
      <div className="flex flex-col gap-4">
        <CredentialsForm setCredentials={setCredentials} />
        <ProfileForm setProfile={setProfile} />
        <Button type="submit" onClick={signUp} disabled={isWaiting || !credentials || !profile}>
          {isWaiting ? (
            <Spinner aria-label="spinner" size="md" />
          ) : (
            "Zarejestruj się"
          )}
        </Button>
      </div>
    </KeyboardEventHandler>
  );
};
