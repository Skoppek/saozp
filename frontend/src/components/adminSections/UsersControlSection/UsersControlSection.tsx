import { ToggleSwitch } from "flowbite-react/components/ToggleSwitch";
import { ClassName } from "../../../shared/interfaces/ClassName.ts";
import { TextInput } from "../../TextInput.tsx";
import { UsersList } from "./UsersList.tsx";
import { UserAdminDataFilter } from "../../../shared/interfaces/UserAdminData.ts";
import { useState } from "react";

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
          <TextInput
            id={"id"}
            label="Id"
            onChange={(value) => {
              setFilter((prev) => {
                return { ...prev, id: value.toLowerCase() };
              });
            }}
          />
          <TextInput
            id={"login"}
            label="Login"
            className="grow"
            onChange={(value) => {
              setFilter((prev) => {
                return { ...prev, login: value.toLowerCase() };
              });
            }}
          />
          <TextInput
            id={"firstName"}
            label="Imię"
            className="grow"
            onChange={(value) => {
              setFilter((prev) => {
                return { ...prev, firstName: value.toLowerCase() };
              });
            }}
          />
          <TextInput
            id={"lastName"}
            label="Nazwisko"
            className="grow"
            onChange={(value) => {
              setFilter((prev) => {
                return { ...prev, lastName: value.toLowerCase() };
              });
            }}
          />
          <div className="flex h-full flex-col justify-end gap-2">
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
        </div>
        <UsersList filter={filter} />
      </div>
    </div>
  );
};
