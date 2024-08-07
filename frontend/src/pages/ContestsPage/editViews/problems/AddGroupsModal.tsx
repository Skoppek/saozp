import { Modal } from "flowbite-react/components/Modal";
import apiClient from "../../../../client/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Table } from "flowbite-react/components/Table";
import { Spinner } from "flowbite-react/components/Spinner";
import { Checkbox } from "flowbite-react/components/Checkbox";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react/components/Button";
import _ from "lodash";
import { Group } from "../../../../shared/interfaces/Group";

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
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["groups"],
    queryFn: () => apiClient.groups.getAll(),
  });

  const [selected, setSelected] = useState<Group[]>([]);

  useEffect(() => {
    refetch();
  }, [show]);

  return (
    <Modal show={show}>
      <Modal.Header>Dodaj uczestników z grup</Modal.Header>
      <Modal.Body>
        <Button
          color={"success"}
          onClick={() => {
            Promise.all(
              selected.map((group) =>
                apiClient.contests.addParticipants(
                  contestId,
                  undefined,
                  group.id,
                ),
              ),
            ).then(() => {
              onClose();
            });
          }}
        >
          Dodaj
        </Button>
        <Table>
          <Table.Head>
            <Table.HeadCell>Nazwa</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {data && !isFetching ? (
              data.map((group) => (
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
