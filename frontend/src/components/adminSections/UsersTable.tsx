import { Button, Table } from "flowbite-react";
import { HiCheck, HiDotsVertical } from "react-icons/hi";
import { UserAdminData } from "../../shared/interfaces/UserAdminData.ts";

export interface UsersTableItem extends UserAdminData {
  isSessionActive: boolean;
}

interface UsersTableInterface {
  users: UsersTableItem[];
  onSelect: (user: UsersTableItem) => void;
}

export const UsersTable = ({ users, onSelect }: UsersTableInterface) => {
  return (
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
        {users.map((user, index) => (
          <Table.Row id={`${index}userRow`}>
            <Table.Cell>{user.userId}</Table.Cell>
            <Table.Cell>{user.login}</Table.Cell>
            <Table.Cell>{user.firstName}</Table.Cell>
            <Table.Cell>{user.lastName}</Table.Cell>
            <Table.Cell>{user.isAdmin && <HiCheck size={25} />}</Table.Cell>
            <Table.Cell>{user.sessionId && <HiCheck size={25} />}</Table.Cell>
            <Table.Cell>
              {user.isSessionActive && <HiCheck size={25} />}
            </Table.Cell>
            <Table.Cell>
              <Button size={"sm"} outline onClick={() => onSelect(user)}>
                <HiDotsVertical size={20} />
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
