import { Modal } from "flowbite-react/components/Modal";
import apiClient from "../../../../client/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Table } from "flowbite-react/components/Table";
import { Spinner } from "flowbite-react/components/Spinner";
import { Checkbox } from "flowbite-react/components/Checkbox";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import _ from "lodash";
import { ProblemEntry } from "../../../../shared/interfaces/ProblemEntry";
import { Badge } from "flowbite-react/components/Badge";
import { getLanguageById } from "../../../../shared/constansts";
import { TextInput } from "../../../../components/inputs/TextInput";

type Problem = Pick<ProblemEntry, "problemId" | "name" | "languageId">;

interface AddProblemsModalProps {
  contestId: number;
  stageId: number;
  show: boolean;
  problems: Problem[];
  onClose: () => void;
}

export const AddProblemsModal = ({
  contestId,
  stageId,
  show,
  onClose,
  problems,
}: AddProblemsModalProps) => {
  const { data, isFetching } = useQuery({
    queryKey: ["allProblems", contestId],
    queryFn: () => apiClient.problems.getAll(),
  });

  const [selected, setSelected] = useState<Problem[]>([]);
  const [nameFilter, setNameFilter] = useState("");

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Dodaj zadania</Modal.Header>
      <Modal.Body>
        <div className="flex w-full gap-2">
          <TextInput
            className="w-full"
            placeholder="Szukaj po nazwie"
            type="text"
            id={"problemFilter"}
            onChange={(value) => setNameFilter(value.toLowerCase())}
          />
          <Button
            color={"success"}
            onClick={() =>
              apiClient.contests
                .addProblems(
                  contestId,
                  stageId,
                  selected.map((x) => x.problemId),
                )
                .then(onClose)
            }
          >
            Dodaj
          </Button>
        </div>
        <Table>
          <Table.Head>
            <Table.HeadCell>Nazwa</Table.HeadCell>
            <Table.HeadCell>Język</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {data && !isFetching ? (
              _.differenceBy(data, problems, "problemId")
                .filter((problem) =>
                  problem.name.toLowerCase().includes(nameFilter),
                )
                .map((problem) => (
                  <Table.Row>
                    <Table.Cell>{problem.name}</Table.Cell>
                    <Table.Cell>
                      <Badge className="w-fit">
                        {getLanguageById(problem.languageId)?.name ??
                          "Nieznany"}
                      </Badge>
                    </Table.Cell>
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
                  </Table.Row>
                ))
            ) : (
              <Spinner />
            )}
          </Table.Body>
        </Table>
      </Modal.Body>
    </Modal>
  );
};
