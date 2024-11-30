import { Modal } from "flowbite-react/components/Modal";
import apiClient from "../../../../client/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Table } from "flowbite-react/components/Table";
import { Spinner } from "flowbite-react/components/Spinner";
import { Checkbox } from "flowbite-react/components/Checkbox";
import { Profile } from "../../../../shared/interfaces/Profile";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react/components/Button";
import _ from "lodash";
import { displayNames } from "../../../../shared/functions";
import { TextInput } from "../../../../components/inputs/TextInput";

interface AddParticipantsModalProps {
  contestId: number;
  show: boolean;
  participants: Profile[];
  onClose: () => void;
}

export const AddParticipantsModal = ({
  contestId,
  show,
  onClose,
  participants,
}: AddParticipantsModalProps) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => apiClient.groups.getAllUsers(),
  });

  const [selected, setSelected] = useState<Profile[]>([]);
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    refetch();
  }, [show, refetch]);

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Dodaj uczestników</Modal.Header>
      <Modal.Body>
        <div className="flex w-full gap-2">
          <TextInput
            className="w-full"
            placeholder="Szukaj"
            type="text"
            id={"participantFilter"}
            onChange={(value) => setNameFilter(value.toLowerCase())}
          />
          <Button
            color={"success"}
            onClick={() =>
              apiClient.contests
                .addParticipants(
                  contestId,
                  selected.map((x) => x.userId),
                )
                .then(onClose)
            }
          >
            Dodaj
          </Button>
        </div>
        <Table>
          <Table.Head>
            <Table.HeadCell>Imię</Table.HeadCell>
            <Table.HeadCell>Nazwisko</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {data && !isFetching ? (
              _.differenceBy(data, participants, "userId")
                .filter((participant) =>
                  displayNames(participant).toLowerCase().includes(nameFilter),
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
