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

  useEffect(() => {
    refetch();
  }, [show]);

  return (
    <Modal show={show}>
      <Modal.Header>Dodaj uczestników</Modal.Header>
      <Modal.Body>
        <Button
          color={"success"}
          onClick={() =>
            apiClient.contests
              .addParticipants(
                contestId,
                selected.map((x) => x.userId),
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
            <Table.HeadCell>Imię</Table.HeadCell>
            <Table.HeadCell>Nazwisko</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {data && !isFetching ? (
              _.differenceBy(data, participants, "userId").map((user) => (
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
