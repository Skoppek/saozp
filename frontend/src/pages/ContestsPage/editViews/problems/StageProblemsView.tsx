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
import { TextInput } from "../../../../components/inputs/TextInput";
import { useContestContext } from "../../../../shared/useContestContext";

type Problem = Pick<ProblemEntry, "problemId" | "name" | "languageId">;

export const StageProblemsView = ({ stageId }: { stageId: number }) => {
  const { id: contestId } = useContestContext();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["stage", stageId, "problems"],
    queryFn: () => apiClient.contests.getStage(contestId, stageId),
  });

  const [selected, setSelected] = useState<Problem[]>([]);
  const [showAddProblems, setShowAddProblems] = useState(false);
  const [showAddBundles, setShowAddBundles] = useState(false);
  const [nameFilter, setNameFilter] = useState("");

  return (
    <div>
      {data && !isFetching ? (
        <>
          <AddProblemsModal
            contestId={contestId}
            stageId={stageId}
            show={showAddProblems}
            problems={data.problems}
            onClose={() => {
              setShowAddProblems(false);
              refetch();
            }}
          />
          <AddBundlesModal
            contestId={contestId}
            stageId={stageId}
            show={showAddBundles}
            onClose={() => {
              setShowAddBundles(false);
              void refetch();
            }}
          />
          <div className="flex flex-col gap-2">
            <div className="flex w-full gap-1">
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
                      stageId,
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
            <TextInput
              className="w-full"
              placeholder="Szukaj"
              type="text"
              id={"problemFilter"}
              onChange={(value) => setNameFilter(value.toLowerCase())}
            />
            <Table>
              <Table.Head>
                <Table.HeadCell>Nazwa</Table.HeadCell>
                <Table.HeadCell>Język</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {data.problems
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
