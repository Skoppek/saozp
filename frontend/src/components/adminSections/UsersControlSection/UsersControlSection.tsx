import { ToggleSwitch } from "flowbite-react/components/ToggleSwitch";
import { ClassName } from "../../../shared/interfaces/ClassName.ts";
import { UsersList } from "./UsersList.tsx";
import { UserAdminDataFilter } from "../../../shared/interfaces/UserAdminData.ts";
import { useState } from "react";
import { FloatingLabel } from "flowbite-react";

interface UsersControlSectionProps extends ClassName {}

export const UsersControlSection = ({
  className,
}: UsersControlSectionProps) => {
  const [filter, setFilter] = useState<UserAdminDataFilter>({
    id: "",
    login: "",
    firstName: "",
    lastName: "",
  });

  return (
    <div
      className={`${className} flex h-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800`}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="text-3xl">Widok użytkowników</div>
        <div className="flex flex-wrap items-center gap-4">
          <FloatingLabel
            type="text"
            onChange={(event) => {
              setFilter((prev) => {
                return { ...prev, id: event.target.value.toLowerCase() };
              });
            }}
            label="Id"
            variant="standard"
          />
          <FloatingLabel
            type="text"
            onChange={(event) => {
              setFilter((prev) => {
                return { ...prev, login: event.target.value.toLowerCase() };
              });
            }}
            label="Login"
            variant="standard"
          />
          <FloatingLabel
            type="text"
            onChange={(event) => {
              setFilter((prev) => {
                return { ...prev, firstName: event.target.value.toLowerCase() };
              });
            }}
            label="Imię"
            variant="standard"
          />
          <FloatingLabel
            type="text"
            onChange={(event) => {
              setFilter((prev) => {
                return { ...prev, lastName: event.target.value.toLowerCase() };
              });
            }}
            label="Nazwisko"
            variant="standard"
          />
          <ToggleSwitch
            checked={!!filter.isAdmin}
            label="Admin"
            onChange={() =>
              setFilter((prev) => {
                return { ...prev, isAdmin: !prev.isAdmin };
              })
            }
          />
          <ToggleSwitch
            checked={!!filter.hasSession}
            label="Aktywna sesja"
            onChange={() =>
              setFilter((prev) => {
                return { ...prev, hasSession: !prev.hasSession };
              })
            }
          />
        </div>
        <UsersList filter={filter} />
      </div>
    </div>
  );
};
