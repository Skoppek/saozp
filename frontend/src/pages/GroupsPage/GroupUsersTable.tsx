import { Checkbox, FloatingLabel, Table } from "flowbite-react";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { displayNames } from "../../shared/functions";

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
    <div className={"flex w-1/2 flex-col"}>
      <div className="flex w-full flex-col gap-2">
        <FloatingLabel
          type="text"
          onChange={(event) => setNameFilter(event.target.value.toLowerCase())}
          label="Szukaj"
          variant="standard"
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
