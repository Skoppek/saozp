import { useCallback, useEffect, useMemo, useState } from "react";
import apiClient from "../../apiClient";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import {
  UserAdminData,
  UserAdminDataFilter,
} from "../../shared/interfaces/UserAdminData";
import { HiDotsVertical } from "react-icons/hi";

interface UsersListProps {
  filter: UserAdminDataFilter;
}

export const UsersList = ({ filter }: UsersListProps) => {
  const [users, setUsers] = useState<UserAdminData[]>();
  const [selectedUser, setSelectedUser] = useState<UserAdminData | undefined>();
  const [errorMsg, setErrorMsg] = useState<string | undefined>();

  const isSessionActive = useCallback(
    (sessionId?: string, sessionExpiryDate?: string) => {
      return (
        sessionId &&
        sessionExpiryDate &&
        new Date(sessionExpiryDate) > new Date()
      );
    },
    [],
  );

  useEffect(() => {
    apiClient
      .getUsersWithProfiles()
      .then((data) => {
        setUsers(data);
      })
      .catch(() => {
        setUsers([]);
      });
  }, []);

  const filteredUsers = useMemo<UserAdminData[]>(() => {
    if (!users) return [];
    return users.filter(
      (user) =>
        user.userId.toString().toLowerCase().includes(filter.id) &&
        user.login.toLowerCase().includes(filter.login) &&
        user.firstName.toLowerCase().includes(filter.firstName) &&
        user.lastName.toLowerCase().includes(filter.lastName) &&
        (filter.isAdmin ? user.isAdmin : true) &&
        (filter.hasSession ? !!user.sessionId : true),
    );
  }, [
    filter.firstName,
    filter.hasSession,
    filter.id,
    filter.isAdmin,
    filter.lastName,
    filter.login,
    users,
  ]);

  return (
    <>
      <Modal
        show={!!selectedUser}
        onClose={() => {
          setSelectedUser(undefined);
          setErrorMsg(undefined);
        }}
      >
        <Modal.Header>Kontrola użytkownika</Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="flex flex-col gap-2">
              {selectedUser.sessionId && (
                <Button
                  onClick={() => {
                    if (selectedUser.sessionId) {
                      apiClient
                        .revokeSession(selectedUser.sessionId)
                        .catch((error) => {
                          if (error.response.status === 400) {
                            setErrorMsg(
                              "Nie możesz zakończyć swojej sesji. Aby to zrobić, wyloguj się.",
                            );
                            setTimeout(() => setErrorMsg(undefined), 5000);
                          }
                        });
                    }
                  }}
                >
                  Zakończ sesję
                </Button>
              )}
              <Button
                onClick={() => {
                  if (selectedUser.isAdmin) {
                    apiClient
                      .revokeAdmin(selectedUser.userId)
                      .catch((error) => {
                        if (error.response.status === 400) {
                          setErrorMsg("Nie odebrać sobie roli administratora.");
                          setTimeout(() => setErrorMsg(undefined), 5000);
                        }
                      });
                  } else {
                    apiClient.promoteToAdmin(selectedUser.userId);
                  }
                }}
              >
                {selectedUser.isAdmin ? "Odbierz" : "Nadaj"} rolę administratora
              </Button>
              {errorMsg && (
                <div className="text-base text-rose-500">{errorMsg}</div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
      {users ? (
        <Table>
          <Table.Head>
            <Table.HeadCell>Id</Table.HeadCell>
            <Table.HeadCell>Login</Table.HeadCell>
            <Table.HeadCell>Imię</Table.HeadCell>
            <Table.HeadCell>Nazwisko</Table.HeadCell>
            <Table.HeadCell>Admin</Table.HeadCell>
            <Table.HeadCell>Sesja</Table.HeadCell>
            <Table.HeadCell>Sesja ważna do</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edytuj</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredUsers.map((user, index) => (
              <Table.Row id={`${index}userRow`}>
                <Table.Cell>{user.userId}</Table.Cell>
                <Table.Cell>{user.login}</Table.Cell>
                <Table.Cell>{user.firstName}</Table.Cell>
                <Table.Cell>{user.lastName}</Table.Cell>
                <Table.Cell>{user.isAdmin && <HiCheck size={25} />}</Table.Cell>
                <Table.Cell>
                  {user.sessionId && <HiCheck size={25} />}
                </Table.Cell>
                <Table.Cell>
                  {isSessionActive(user.sessionId, user.sessionExpiryDate) &&
                    user.sessionExpiryDate &&
                    `${new Date(user.sessionExpiryDate).toLocaleDateString()} ${new Date(user.sessionExpiryDate).toLocaleTimeString()}`}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size={"sm"}
                    outline
                    onClick={() => setSelectedUser(user)}
                  >
                    <HiDotsVertical size={20} />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="flex w-full justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
};
