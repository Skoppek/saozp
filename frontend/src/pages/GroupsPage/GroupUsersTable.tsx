import { Checkbox, Table } from "flowbite-react";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { displayNames } from "../../shared/functions";
import { TextInput } from "../../components/inputs/TextInput";

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
  const [nameFilter, setNameFilter] = useState("");

  return (
    <div className={"flex flex-col w-1/2"}>
      <div className="flex flex-col gap-2 w-full">
        <TextInput
          className="w-full"
          placeholder="Szukaj"
          type="text"
          id={"memberFilter"}
          onChange={(value) => setNameFilter(value.toLowerCase())}
        />
        <Button
          onClick={() => {
            onConfirm(selected);
            setSelected([]);
          }}
          disabled={!selected.length}
        >
          {confirmLabel}
        </Button>
      </div>

      <Table>
        <Table.Body>
          {data
            .filter((member) =>
              displayNames(member).toLowerCase().includes(nameFilter),
            )
            .map((user) => (
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
