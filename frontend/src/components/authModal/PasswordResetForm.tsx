import { Button, Spinner, Tooltip } from "flowbite-react";
import { useCallback, useState, useMemo } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { useToast } from "../../contexts/ToastContext/useToast";
import apiClient from "../../client/apiClient";
import { ValidatedInput } from "../inputs/ValidatedInput";

const getTokenHint =
  "W razie braku tokena zmiany hasła zgłoś się po nowy do administratora.";

export const PasswordResetForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isLoading, setLoading] = useState(false);

  const [login, setLogin] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return login && password && token;
  }, [login, password, token]);

  const { showToast } = useToast();

  const submit = useCallback(async () => {
    setLoading(true);
    await apiClient.auth
      .changePassword({
        token: token!,
        login: login!,
        password: password!,
      })
      .then(() => {
        setLoading(false);
        onSuccess();
        showToast({ content: "Hasło zostało zmienione.", type: "success" });
      })
      .catch(() => {
        setLoading(false);
        showToast({
          content: "Nie udało się zmienić hasła.",
          type: "failure",
        });
      });
  }, [login, onSuccess, password, showToast, token]);

  return (
    <KeyboardEventHandler
      handleKeys={["enter"]}
      handleEventType="keydown"
      onKeyEvent={submit}
    >
      <div className="flex flex-col gap-2">
        <ValidatedInput
          label={"Login"}
          maxLength={64}
          minLength={1}
          onError={() => setLogin(null)}
          onCorrect={(value) => setLogin(value)}
        />
        <Tooltip
          content={getTokenHint}
          style={"light"}
          placement={"right-start"}
        >
          <ValidatedInput
            label={"Token zmiany hasła"}
            maxLength={4}
            minLength={4}
            onError={() => setToken(null)}
            onCorrect={(value) => setToken(value)}
          />
        </Tooltip>
        <ValidatedInput
          label={"Nowe hasło"}
          type={"password"}
          maxLength={64}
          minLength={1}
          onError={() => setPassword(null)}
          onCorrect={(value) => setPassword(value)}
        />
        <Button onClick={submit} disabled={!isValid}>
          {isLoading ? <Spinner /> : "Zmień hasło"}
        </Button>
      </div>
    </KeyboardEventHandler>
  );
};
