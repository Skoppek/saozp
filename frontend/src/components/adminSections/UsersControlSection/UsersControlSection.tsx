import { ToggleSwitch } from "flowbite-react/components/ToggleSwitch";
import { ClassName } from "../../../shared/interfaces/ClassName.ts";
import { UsersList } from "./UsersList.tsx";
import { UserAdminDataFilter } from "../../../shared/interfaces/UserAdminData.ts";
import { useState } from "react";
import { TextFilterInput } from "../../inputs/TextFilterInput.tsx";

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
          <div className="flex w-full gap-4">
            <TextFilterInput
              label="Id"
              onChange={(value) => {
                setFilter((prev) => {
                  return { ...prev, id: value.toLowerCase() };
                });
              }}
            />
            <TextFilterInput
              label="Login"
              onChange={(value) => {
                setFilter((prev) => {
                  return { ...prev, login: value.toLowerCase() };
                });
              }}
            />
          </div>
          <div className="flex w-full gap-4">

          <TextFilterInput
            label="Imię"
            onChange={(value) => {
              setFilter((prev) => {
                return { ...prev, firstName: value.toLowerCase() };
              });
            }}
          />
          <TextFilterInput
            label="Nazwisko"
            onChange={(value) => {
              setFilter((prev) => {
                return { ...prev, lastName: value.toLowerCase() };
              });
            }}
          />
          </div>
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
