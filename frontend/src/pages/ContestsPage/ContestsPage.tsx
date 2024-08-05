import { useQuery } from "@tanstack/react-query";
import { AuthenticatedPage } from "../AuthenticatedPage.tsx";
import apiClient from "../../client/apiClient.ts";
import { Table } from "flowbite-react/components/Table";
import { Button, Spinner } from "flowbite-react";
import moment from "moment";
import { HiDotsVertical } from "react-icons/hi";
import { useState } from "react";
import { ContestCreateModal } from "./ContestCreateModal.tsx";

export const ContestsPage = () => {
  const [showCreationModal, setShowCreationModal] = useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ["contests"],
    queryFn: () => apiClient.contests.getAll(),
  });

  return (
    <AuthenticatedPage>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4 overflow-x-auto pt-12">
          <div className="flex flex-col gap-4">
            <ContestCreateModal
              show={showCreationModal}
              onClose={() => setShowCreationModal(false)}
            />
            <Button
              size={"xs"}
              color={"success"}
              onClick={() => setShowCreationModal(true)}
            >
              Utwórz zawody
            </Button>
            <Table>
              <Table.Head>
                <Table.HeadCell>Nazwa</Table.HeadCell>
                <Table.HeadCell>Start</Table.HeadCell>
                <Table.HeadCell>Koniec</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              {!isFetching && data ? (
                <Table.Body>
                  {data.map((contest) => (
                    <Table.Row>
                      <Table.Cell>{contest.name}</Table.Cell>
                      <Table.Cell>
                        {moment(contest.startDate).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>
                        {moment(contest.endDate).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Button outline color="gray">
                          <HiDotsVertical />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              ) : (
                <Spinner />
              )}
            </Table>
          </div>
        </div>
      </div>
    </AuthenticatedPage>
  );
};
