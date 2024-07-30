import { AuthenticatedPage } from "./AuthenticatedPage.tsx";
import { Table } from "flowbite-react";
import { Button } from "flowbite-react/components/Button";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../client/apiClient.ts";
import { Spinner } from "flowbite-react/components/Spinner";
import { Modal } from "flowbite-react/components/Modal";
import { TextInput } from "../components/TextInput.tsx";
import { useState } from "react";

export const GroupsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: number;
    name: string;
  }>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["groups"],
    queryFn: () => apiClient.groups.getAll(),
  });

  return (
    <AuthenticatedPage>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4 overflow-x-auto pt-12">
          <Modal
            show={showModal}
            onClose={() => {
              setSelectedGroup(undefined);
              setShowModal(false);
            }}
          >
            <Modal.Header>
              {selectedGroup ? "Edycja grupy" : "Tworzenie nowej grupy"}
            </Modal.Header>
            <Modal.Body>
              <div>
                <TextInput
                  id={"groupName"}
                  label={"Nazwa grupy"}
                  value={selectedGroup?.name}
                />
              </div>
            </Modal.Body>
          </Modal>
          <div className="flex flex-col gap-2">
            <Button
              size={"xs"}
              color={"green"}
              onClick={() => setShowModal(true)}
            >
              Stwórz nową grupę
            </Button>
            {!isLoading && data ? (
              <Table className="w-[512px]">
                <Table.Head>
                  <Table.HeadCell>Nazwa</Table.HeadCell>
                  <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {[{ id: 4, name: "sad" }].map((group) => (
                    <Table.Row className="w-full bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{group.name}</Table.Cell>
                      <Table.Cell>
                        <Button
                          size={"xs"}
                          onClick={() => {
                            setSelectedGroup(group);
                            setShowModal(true);
                          }}
                        >
                          Edytuj
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <Spinner aria-label="Extra large spinner" size="xl" />
            )}
          </div>
        </div>
      </div>
    </AuthenticatedPage>
  );
};
