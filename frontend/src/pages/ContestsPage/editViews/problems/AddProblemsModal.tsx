import { Modal } from "flowbite-react/components/Modal";
import apiClient from "../../../../client/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Table } from "flowbite-react/components/Table";
import { Spinner } from "flowbite-react/components/Spinner";
import { Checkbox } from "flowbite-react/components/Checkbox";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react/components/Button";
import _ from "lodash";
import { ProblemEntry } from "../../../../shared/interfaces/ProblemEntry";
import { Badge } from "flowbite-react/components/Badge";
import { getLanguageById } from "../../../../shared/constansts";

type Problem = Pick<ProblemEntry, "problemId" | "name" | "languageId">;

interface AddProblemsModalProps {
  contestId: number;
  show: boolean;
  problems: Problem[];
  onClose: () => void;
}

export const AddProblemsModal = ({
  contestId,
  show,
  onClose,
  problems,
}: AddProblemsModalProps) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["allProblems"],
    queryFn: () => apiClient.problems.getAll(),
  });

  const [selected, setSelected] = useState<Problem[]>([]);

  useEffect(() => {
    refetch();
  }, [show]);

  return (
    <Modal show={show}>
      <Modal.Header>Dodaj zadania</Modal.Header>
      <Modal.Body>
        <Button
          color={"success"}
          onClick={() =>
            apiClient.contests
              .addProblems(
                contestId,
                selected.map((x) => x.problemId),
              )
              .then(() => {
                onClose();
              })
          }
        >
          Dodaj
        </Button>
        <Table>
          <Table.Head>
            <Table.HeadCell>Nazwa</Table.HeadCell>
            <Table.HeadCell>Język</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {data && !isFetching ? (
              _.differenceBy(data, problems, "problemId").map((problem) => (
                <Table.Row>
                  <Table.Cell>{problem.name}</Table.Cell>
                  <Table.Cell>
                    <Badge className="w-fit">
                      {getLanguageById(problem.languageId)?.name ?? "Nieznany"}
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
