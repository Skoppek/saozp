import { ClassName } from "../../shared/interfaces/ClassName";
import { UsersList } from "./UsersList";

interface UsersControlSectionProps extends ClassName {}

export const UsersControlSection = ({
  className,
}: UsersControlSectionProps) => {
  return (
    <div
      className={`${className} flex h-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800`}
    >
      <div className="flex w-full flex-col">
        <div className="text-3xl">Widok użytkowników</div>
        <div>filtry</div>
        <UsersList />
      </div>
    </div>
  );
};
