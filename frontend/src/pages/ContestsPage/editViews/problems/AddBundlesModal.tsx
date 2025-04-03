import { Modal } from "flowbite-react/components/Modal";
import apiClient from "../../../../client/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Table } from "flowbite-react/components/Table";
import { Spinner } from "flowbite-react/components/Spinner";
import { Checkbox } from "flowbite-react/components/Checkbox";
import { useState } from "react";
import { Button } from "flowbite-react/components/Button";
import { Bundle } from "../../../../shared/interfaces/Bundle";
import { TextFilterInput } from "../../../../components/inputs/TextFilterInput";

interface AddBundlesModalProps {
  contestId: number;
  stageId: number;
  show: boolean;
  onClose: () => void;
}

export const AddBundlesModal = ({
  contestId,
  stageId,
  show,
  onClose,
}: AddBundlesModalProps) => {
  const { data, isFetching } = useQuery({
    queryKey: ["bundles", contestId],
    queryFn: () => apiClient.bundles.getAll(),
  });

  const [selected, setSelected] = useState<Bundle[]>([]);
  const [nameFilter, setNameFilter] = useState("");

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Dodaj zadania z paczek</Modal.Header>
      <Modal.Body>
        <div className="flex w-full gap-2">
          <TextFilterInput
            label="Szukaj"
            onChange={(value) => setNameFilter(value.toLowerCase())}
          />
          <Button
            color={"success"}
            onClick={() => {
              Promise.all(
                selected.map((bundle) =>
                  apiClient.contests.addBundle(contestId, stageId, bundle.id),
                ),
              ).then(() => {
                onClose();
              });
            }}
          >
            Dodaj
          </Button>
        </div>
        <Table>
          <Table.Head>
            <Table.HeadCell>Nazwa</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {data && !isFetching ?
              data
                .filter((bundle) =>
                  bundle.name.toLowerCase().includes(nameFilter),
                )
                .map((bundle) => (
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
            : <Spinner />}
          </Table.Body>
        </Table>
      </Modal.Body>
    </Modal>
  );
};
