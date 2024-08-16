import { UserLoggedCheck } from "../../checks/UserLoggedCheck.tsx";
import { Table } from "flowbite-react";
import { Button } from "flowbite-react/components/Button";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient.ts";
import { Spinner } from "flowbite-react/components/Spinner";
import { useState } from "react";
import { GroupCreateModal } from "./GroupCreateModal.tsx";
import { GroupDeleteModal } from "./GroupDeleteModal.tsx";
import { GroupEditModal } from "./GroupEditModal.tsx";
import { TextInput } from "../../components/inputs/TextInput.tsx";

export const GroupsPage = () => {
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: number;
    name: string;
  }>();
  const [nameFilter, setNameFilter] = useState("");

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["groups"],
    queryFn: () => apiClient.groups.getAll(),
  });

  return (
    <UserLoggedCheck>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4 overflow-x-auto pt-12">
          <GroupCreateModal
            show={showCreationModal}
            onClose={() => {
              setShowCreationModal(false);
              void refetch();
            }}
          />
          {selectedGroup && (
            <>
              <GroupEditModal
                group={selectedGroup}
                show={showEditModal}
                onClose={() => {
                  setShowEditModal(false);
                  void refetch();
                }}
              />
              <GroupDeleteModal
                group={selectedGroup}
                show={showDeletionModal}
                onClose={() => {
                  setShowDeletionModal(false);
                  void refetch();
                }}
              />
            </>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 w-full">
              <TextInput
                className="w-full"
                placeholder="Szukaj po nazwie"
                type="text"
                id={"groupFilter"}
                onChange={(value) => setNameFilter(value.toLowerCase())}
              />
              <Button
                color={"green"}
                onClick={() => setShowCreationModal(true)}
              >
                Stwórz
              </Button>
            </div>
            {!isFetching && data ? (
              <Table className="w-[512px]">
                <Table.Head>
                  <Table.HeadCell>Nazwa</Table.HeadCell>
                  <Table.HeadCell></Table.HeadCell>
                  <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {data
                    .filter((group) =>
                      group.name.toLowerCase().includes(nameFilter),
                    )
                    .map((group) => (
                      <Table.Row className="w-full bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{group.name}</Table.Cell>
                        <Table.Cell>
                          <Button
                            size={"xs"}
                            color={"success"}
                            onClick={() => {
                              setSelectedGroup(group);
                              setShowEditModal(true);
                            }}
                          >
                            Edytuj
                          </Button>
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            size={"xs"}
                            color={"failure"}
                            onClick={() => {
                              setSelectedGroup(group);
                              setShowDeletionModal(true);
                            }}
                          >
                            Usuń
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
    </UserLoggedCheck>
  );
};
