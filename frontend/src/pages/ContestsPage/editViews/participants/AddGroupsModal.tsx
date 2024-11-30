import { Modal } from "flowbite-react/components/Modal";
import apiClient from "../../../../client/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Table } from "flowbite-react/components/Table";
import { Spinner } from "flowbite-react/components/Spinner";
import { Checkbox } from "flowbite-react/components/Checkbox";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { Group } from "../../../../shared/interfaces/Group";
import { TextInput } from "../../../../components/inputs/TextInput";

const AddGroupsButton = ({
  group: participants,
  contestId,
  onSucces,
}: {
  group: Group[];
  contestId: number;
  onSucces: () => void;
}) => {
  return (
    <Button
      color={"success"}
      onClick={() => {
        Promise.all(
          participants.map((group) =>
            apiClient.contests.addParticipants(contestId, undefined, group.id),
          ),
        ).then(() => {
          onSucces();
        });
      }}
    >
      Dodaj
    </Button>
  );
};

interface AddGroupsModalProps {
  contestId: number;
  show: boolean;
  onClose: () => void;
}

export const AddGroupsModal = ({
  contestId,
  show,
  onClose,
}: AddGroupsModalProps) => {
  const { data, isFetching } = useQuery({
    queryKey: ["groups", contestId],
    queryFn: () => apiClient.groups.getAll(),
  });

  const [selected, setSelected] = useState<Group[]>([]);
  const [nameFilter, setNameFilter] = useState("");

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Dodaj uczestników z grup</Modal.Header>
      <Modal.Body className="w-full">
        <div className="flex w-full gap-2">
          <TextInput
            className="w-full"
            placeholder="Szukaj po nazwie"
            type="text"
            id={"groupFilter"}
            onChange={(value) => setNameFilter(value.toLowerCase())}
          />
          <AddGroupsButton
            group={selected}
            contestId={contestId}
            onSucces={onClose}
          />
        </div>
        <Table>
          <Table.Head>
            <Table.HeadCell>Nazwa</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {data && !isFetching ? (
              data
                .filter((group) =>
                  group.name.toLowerCase().includes(nameFilter),
                )
                .map((group) => (
                  <Table.Row>
                    <Table.Cell>{group.name}</Table.Cell>
                    <Table.Cell>
                      <Checkbox
                        onChange={() => {
                          if (selected?.includes(group)) {
                            setSelected((prev) =>
                              prev.filter((item) => item != group),
                            );
                          } else {
                            setSelected((prev) => [...prev, group]);
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
