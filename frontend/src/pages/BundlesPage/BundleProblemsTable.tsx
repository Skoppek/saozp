import { Checkbox, Table } from "flowbite-react";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { getLanguageById } from "../../shared/constansts.ts";
import { Badge } from "flowbite-react/components/Badge";

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
  return (
    <div className={"flex flex-col"}>
      <Button onClick={() => onConfirm(selected)} disabled={!selected.length}>
        {confirmLabel}
      </Button>
      <Table>
        <Table.Body>
          {data.map((problem) => (
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
