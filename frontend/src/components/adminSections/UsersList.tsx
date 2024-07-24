import { useCallback, useMemo, useState } from "react";
import { Spinner } from "flowbite-react";
import {
  UserAdminData,
  UserAdminDataFilter,
} from "../../shared/interfaces/UserAdminData";
import apiClient from "../../client/apiClient.ts";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { UsersTable, UsersTableItem } from "./UsersTable.tsx";
import { UserControlModal } from "./UserControlModal.tsx";

interface UsersListProps {
  filter: UserAdminDataFilter;
}

export const UsersList = ({ filter }: UsersListProps) => {
  const [selectedUser, setSelectedUser] = useState<UserAdminData | undefined>();

  const isSessionActive = useCallback(
    (sessionId?: string, sessionExpiryDate?: Date) => {
      return (
        !!sessionId &&
        !!sessionExpiryDate &&
        moment(sessionExpiryDate).isAfter(moment())
      );
    },
    [],
  );

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: apiClient.admin.getUsers,
  });

  const filteredUsers = useMemo<UserAdminData[]>(() => {
    if (!data) return [];
    return data.filter(
      (user) =>
        user.userId.toString().toLowerCase().includes(filter.id) &&
        user.login.toLowerCase().includes(filter.login) &&
        user.firstName.toLowerCase().includes(filter.firstName) &&
        user.lastName.toLowerCase().includes(filter.lastName) &&
        (filter.isAdmin ? user.isAdmin : true) &&
        (filter.hasSession ? !!user.sessionId : true),
    );
  }, [
    data,
    filter.firstName,
    filter.hasSession,
    filter.id,
    filter.isAdmin,
    filter.lastName,
    filter.login,
  ]);

  const modifiedData = useMemo<UsersTableItem[]>(
    () =>
      filteredUsers.map((user) => {
        return {
          ...user,
          isSessionActive: isSessionActive(
            user.sessionId,
            user.sessionExpiryDate,
          ),
        };
      }),
    [filteredUsers, isSessionActive],
  );

  return (
    <>
      <UserControlModal
        isShown={!!selectedUser}
        close={() => setSelectedUser(undefined)}
        onClose={() => refetch()}
        selectedUser={selectedUser}
      />
      {isFetching ? (
        <div className="flex w-full justify-center">
          <Spinner />
        </div>
      ) : (
        <UsersTable
          users={modifiedData}
          onSelect={(user) => setSelectedUser(user)}
        />
      )}
    </>
  );
};
