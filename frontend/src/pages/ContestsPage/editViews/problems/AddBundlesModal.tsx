import { Modal } from "flowbite-react/components/Modal";
import apiClient from "../../../../client/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Table } from "flowbite-react/components/Table";
import { Spinner } from "flowbite-react/components/Spinner";
import { Checkbox } from "flowbite-react/components/Checkbox";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react/components/Button";
import _ from "lodash";
import { Bundle } from "../../../../shared/interfaces/Bundle";

interface AddBundlesModalProps {
  contestId: number;
  show: boolean;
  onClose: () => void;
}

export const AddBundlesModal = ({
  contestId,
  show,
  onClose,
}: AddBundlesModalProps) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["bundles"],
    queryFn: () => apiClient.bundles.getAll(),
  });

  const [selected, setSelected] = useState<Bundle[]>([]);

  useEffect(() => {
    refetch();
  }, [show]);

  return (
    <Modal show={show}>
      <Modal.Header>Dodaj zadania z paczek</Modal.Header>
      <Modal.Body>
        <Button
          color={"success"}
          onClick={() => {
            Promise.all(
              selected.map((bundle) =>
                apiClient.contests.addProblems(contestId, [], bundle.id),
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
              data.map((bundle) => (
                <Table.Row>
                  <Table.Cell>{bundle.name}</Table.Cell>
                  <Table.Cell>
                    <Checkbox
                      onChange={() => {
                        if (selected?.includes(bundle)) {
                          setSelected((prev) =>
                            prev.filter((item) => item != bundle),
                          );
                        } else {
                          setSelected((prev) => [...prev, bundle]);
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
