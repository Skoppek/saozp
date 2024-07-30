import { AuthenticatedPage } from "../AuthenticatedPage.tsx";
import { Table } from "flowbite-react";
import { Button } from "flowbite-react/components/Button";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient.ts";
import { Spinner } from "flowbite-react/components/Spinner";
import { useState } from "react";
import { GroupCreateModal } from "./GroupCreateModal.tsx";
import { GroupDeleteModal } from "./GroupDeleteModal.tsx";

export const GroupsPage = () => {
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
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
          <GroupCreateModal
            show={showCreationModal}
            onClose={() => {
              setShowCreationModal(false);
              void refetch();
            }}
          />
          {selectedGroup && (
            <GroupDeleteModal
              group={selectedGroup}
              show={showDeletionModal}
              onClose={() => {
                setShowDeletionModal(false);
                void refetch();
              }}
            />
          )}
          <div className="flex flex-col gap-2">
            <Button
              size={"xs"}
              color={"green"}
              onClick={() => setShowCreationModal(true)}
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
                  {data.map((group) => (
                    <Table.Row className="w-full bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{group.name}</Table.Cell>
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
    </AuthenticatedPage>
  );
};
