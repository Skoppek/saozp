import { Button, Tooltip } from "flowbite-react";
import { FloatingLabel } from "flowbite-react/components/FloatingLabel";
import { useCallback, useState } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import apiClient from "../client/apiClient";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

const getTokenHint =
  "W razie braku tokena zmiany hasła zgłoś się po nowy do administratora.";

export const PasswordResetForm = () => {
  const [showWarnings, setShowWarnings] = useState(false);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const resetForm = useCallback(() => {
    setLogin(""), setPassword(""), setToken("");
    setShowWarnings(false);
  }, []);

  const submit = useCallback(async () => {
    await apiClient.auth
      .changePassword({
        token,
        login,
        password,
      })
      .then(() => resetForm())
      .catch(
        (error) =>
          error.status == StatusCodes.NOT_FOUND && setShowWarnings(true),
      );
  }, [login, password, resetForm, token]);

  return (
    <KeyboardEventHandler
      handleKeys={["enter"]}
      handleEventType="keydown"
      onKeyEvent={submit}
    >
      <div className="flex flex-col gap-2">
        <FloatingLabel
          variant="outlined"
          label={"Login"}
          color={showWarnings ? "error" : "default"}
          helperText={showWarnings ? "Niepoprawny login" : undefined}
          onChange={(event) => setLogin(event.target.value)}
          maxLength={64}
        />
        <Tooltip
          content={getTokenHint}
          style={"light"}
          placement={"right-start"}
        >
          <FloatingLabel
            variant="outlined"
            label={"Token zmiany hasła"}
            color={showWarnings ? "error" : "default"}
            helperText={showWarnings ? "Błędny token" : undefined}
            onChange={(event) => setToken(event.target.value)}
            maxLength={32}
          />
        </Tooltip>
        <FloatingLabel
          variant="outlined"
          type={"password"}
          label={"Nowe hasło"}
          onChange={(event) => setPassword(event.target.value)}
          maxLength={64}
        />
        <Button onClick={submit}>Ustaw nowe hasło</Button>
      </div>
    </KeyboardEventHandler>
  );
};
