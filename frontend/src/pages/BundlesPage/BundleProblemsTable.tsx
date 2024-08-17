import { Checkbox, Table } from "flowbite-react";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { getLanguageById } from "../../shared/constansts.ts";
import { Badge } from "flowbite-react/components/Badge";
import { TextInput } from "../../components/inputs/TextInput.tsx";

interface Problem {
  id: number;
  name: string;
  languageId: number;
}

interface BundleProblemsTableProps {
  data: Problem[];
  onConfirm: (users: Problem[]) => void;
  confirmLabel: string;
}

export const BundleProblemsTable = ({
  data,
  onConfirm,
  confirmLabel,
}: BundleProblemsTableProps) => {
  const [selected, setSelected] = useState<Problem[]>([]);
  const [nameFilter, setNameFilter] = useState("");

  return (
    <div className={"flex w-1/2 flex-col"}>
      <div className="flex w-full flex-col gap-2">
        <TextInput
          className="w-full"
          placeholder="Szukaj po nazwie"
          type="text"
          id={"groupFilter"}
          onChange={(value) => setNameFilter(value.toLowerCase())}
        />
        <Button onClick={() => onConfirm(selected)} disabled={!selected.length}>
          {confirmLabel}
        </Button>
      </div>
      <Table>
        <Table.Body>
          {data
            .filter((problem) =>
              problem.name.toLowerCase().includes(nameFilter),
            )
            .map((problem) => (
              <Table.Row>
                <Table.Cell>
                  <Checkbox
                    onChange={() => {
                      if (selected?.includes(problem)) {
                        setSelected((prev) =>
                          prev.filter((item) => item != problem),
                        );
                      } else {
                        setSelected((prev) => [...prev, problem]);
                      }
                    }}
                  />
                </Table.Cell>
                <Table.Cell>{problem.name}</Table.Cell>
                <Table.Cell>
                  <Badge className="w-fit">
                    {getLanguageById(problem.languageId)?.name ??
                      "Nieznany język"}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};
