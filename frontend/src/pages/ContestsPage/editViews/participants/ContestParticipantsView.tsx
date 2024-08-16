import { useQuery } from "@tanstack/react-query";
import { Table } from "flowbite-react/components/Table";
import apiClient from "../../../../client/apiClient";
import { Button } from "flowbite-react/components/Button";
import { Checkbox, Spinner } from "flowbite-react";
import { useState } from "react";
import { Profile } from "../../../../shared/interfaces/Profile";
import { AddParticipantsModal } from "./AddParticipantsModal";
import { AddGroupsModal } from "./AddGroupsModal";
import { displayNames } from "../../../../shared/functions";
import { TextInput } from "../../../../components/inputs/TextInput";

interface ContestParticipantsViewProps {
  contestId: number;
}

export const ContestParticipantsView = ({
  contestId,
}: ContestParticipantsViewProps) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["contestEdit", "participants", contestId],
    queryFn: () => apiClient.contests.getParticipants(contestId),
  });

  const [selected, setSelected] = useState<Profile[]>([]);
  const [showAddParticipants, setShowAddParticipants] = useState(false);
  const [showAddGroups, setShowAddGroups] = useState(false);
  const [nameFilter, setNameFilter] = useState("");

  return (
    <div>
      {data && !isFetching ? (
        <>
          <AddParticipantsModal
            contestId={contestId}
            show={showAddParticipants}
            participants={data}
            onClose={() => {
              setShowAddParticipants(false);
              refetch();
            }}
          />
          <AddGroupsModal
            contestId={contestId}
            show={showAddGroups}
            onClose={() => {
              setShowAddGroups(false);
              refetch();
            }}
          />
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 w-full">
              <Button
                className="w-full"
                size={"xs"}
                color="gray"
                onClick={() => setShowAddParticipants(true)}
              >
                Dodaj uczestnika
              </Button>
              <Button
                className="w-full"
                size={"xs"}
                color="gray"
                onClick={() => setShowAddGroups(true)}
              >
                Dodaj grupę
              </Button>
              <Button
                className="w-full"
                size={"xs"}
                color="red"
                disabled={!selected.length}
                onClick={() =>
                  apiClient.contests
                    .removeParticipants(
                      contestId,
                      selected.map((x) => x.userId),
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
              id={"participantFilter"}
              onChange={(value) => setNameFilter(value.toLowerCase())}
            />
            <Table>
              <Table.Head>
                <Table.HeadCell>Imię</Table.HeadCell>
                <Table.HeadCell>Nazwisko</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {data
                  .filter((participant) =>
                    displayNames(participant)
                      .toLowerCase()
                      .includes(nameFilter),
                  )
                  .map((user) => (
                    <Table.Row>
                      <Table.Cell>{user.firstName}</Table.Cell>
                      <Table.Cell>{user.lastName}</Table.Cell>
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
