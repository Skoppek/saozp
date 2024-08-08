import { useQuery } from "@tanstack/react-query";
import { Table } from "flowbite-react/components/Table";
import apiClient from "../../../../client/apiClient";
import { Button } from "flowbite-react/components/Button";
import { Badge, Checkbox, Spinner } from "flowbite-react";
import { useState } from "react";
import { AddProblemsModal } from "./AddProblemsModal";
import { AddBundlesModal } from "./AddBundlesModal";
import { ProblemEntry } from "../../../../shared/interfaces/ProblemEntry";
import { getLanguageById } from "../../../../shared/constansts";

type Problem = Pick<ProblemEntry, "problemId" | "name" | "languageId">;

interface ContestProblemsViewProps {
  contestId: number;
}

export const ContestProblemsView = ({
  contestId,
}: ContestProblemsViewProps) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["contestEdit", "problems", contestId],
    queryFn: () => apiClient.contests.getProblems(contestId),
  });

  const [selected, setSelected] = useState<Problem[]>([]);
  const [showAddProblems, setShowAddProblems] = useState(false);
  const [showAddBundles, setShowAddBundles] = useState(false);

  return (
    <div>
      {data && !isFetching ? (
        <>
          <AddProblemsModal
            contestId={contestId}
            show={showAddProblems}
            problems={data}
            onClose={() => {
              setShowAddProblems(false);
              refetch();
            }}
          />
          <AddBundlesModal
            contestId={contestId}
            show={showAddBundles}
            onClose={() => {
              setShowAddBundles(false);
              refetch();
            }}
          />
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 w-full">
              <Button
                className="w-full"
                size={"xs"}
                color="gray"
                onClick={() => setShowAddProblems(true)}
              >
                Dodaj problemy
              </Button>
              <Button
                className="w-full"
                size={"xs"}
                color="gray"
                onClick={() => setShowAddBundles(true)}
              >
                Dodaj paczkę
              </Button>
              <Button
                className="w-full"
                size={"xs"}
                color="red"
                disabled={!selected.length}
                onClick={() =>
                  apiClient.contests
                    .removeProblems(
                      contestId,
                      selected.map((x) => x.problemId),
                    )
                    .then(() => {
                      refetch();
                      setSelected([]);
                    })
                }
              >
                Wyrzuć
              </Button>
            </div>
            <Table>
              <Table.Head>
                <Table.HeadCell>Nazwa</Table.HeadCell>
                <Table.HeadCell>Język</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {data.map((problem) => (
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
                ))}
              </Table.Body>
            </Table>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
