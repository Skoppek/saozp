import { UserLoggedCheck } from "../../checks/UserLoggedCheck.tsx";
import { Table } from "flowbite-react";
import { Button } from "flowbite-react/components/Button";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient.ts";
import { Spinner } from "flowbite-react/components/Spinner";
import { useState } from "react";
import { BundleCreateModal } from "./BundleCreateModal.tsx";
import { BundleDeleteModal } from "./BundleDeleteModal.tsx";
import { BundleEditModal } from "./BundleEditModal.tsx";

export const BundlePage = () => {
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected] = useState<{
    id: number;
    name: string;
  }>();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["bundles"],
    queryFn: () => apiClient.bundles.getAll(),
  });

  return (
    <UserLoggedCheck>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4 overflow-x-auto pt-12">
          <BundleCreateModal
            show={showCreationModal}
            onClose={() => {
              setShowCreationModal(false);
              void refetch();
            }}
          />
          {selected && (
            <>
              <BundleEditModal
                bundle={selected}
                show={showEditModal}
                onClose={() => {
                  setShowEditModal(false);
                  void refetch();
                }}
              />
              <BundleDeleteModal
                bundle={selected}
                show={showDeletionModal}
                onClose={() => {
                  setShowDeletionModal(false);
                  void refetch();
                }}
              />
            </>
          )}
          <div className="flex flex-col gap-2">
            <Button
              size={"xs"}
              color={"green"}
              onClick={() => setShowCreationModal(true)}
            >
              Stwórz nową paczkę
            </Button>
            {!isFetching && data ? (
              <Table className="w-[512px]">
                <Table.Head>
                  <Table.HeadCell>Nazwa</Table.HeadCell>
                  <Table.HeadCell></Table.HeadCell>
                  <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {data.map((group) => (
                    <Table.Row className="w-full bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{group.name}</Table.Cell>
                      <Table.Cell>
                        <Button
                          size={"xs"}
                          color={"success"}
                          onClick={() => {
                            setSelected(group);
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
                            setSelected(group);
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
