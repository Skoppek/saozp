import { Checkbox, Table } from "flowbite-react";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";

interface User {
  userId: number;
  firstName: string;
  lastName: string;
}

interface GroupUsersTableProps {
  data: User[];
  onConfirm: (users: User[]) => void;
  confirmLabel: string;
}

export const GroupUsersTable = ({
  data,
  onConfirm,
  confirmLabel,
}: GroupUsersTableProps) => {
  const [selected, setSelected] = useState<User[]>([]);
  return (
    <div className={"flex flex-col"}>
      <Button onClick={() => onConfirm(selected)} disabled={!selected.length}>
        {confirmLabel}
      </Button>
      <Table>
        <Table.Body>
          {data.map((user) => (
            <Table.Row>
              <Table.Cell>
                <Checkbox
                  onChange={() => {
                    if (selected?.includes(user)) {
                      setSelected((prev) =>
                        prev.filter((item) => item != user),
                      );
                    } else {
                      setSelected((prev) => [...prev, user]);
                    }
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                {[user.firstName, user.lastName].join(" ")}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
