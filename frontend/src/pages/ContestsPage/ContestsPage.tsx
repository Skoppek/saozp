import { useQuery } from "@tanstack/react-query";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck.tsx";
import apiClient from "../../client/apiClient.ts";
import { Table } from "flowbite-react/components/Table";
import { Button, ListGroup, Popover, Spinner } from "flowbite-react";
import moment from "moment";
import {
  HiDotsVertical,
  HiOutlineTrash,
  HiEye,
  HiPencilAlt,
} from "react-icons/hi";
import { useContext, useState } from "react";
import { ContestCreateModal } from "./ContestCreateModal.tsx";
import { AuthContext } from "../Root.tsx";
import { useNavigate } from "react-router-dom";

export const ContestsPage = () => {
  const [showCreationModal, setShowCreationModal] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["allContests"],
    queryFn: () => apiClient.contests.getAll({ ownerId: authContext?.id }),
  });

  return (
    <UserLoggedCheck>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4 overflow-x-auto pt-12">
          <div className="flex flex-col gap-4">
            <ContestCreateModal
              show={showCreationModal}
              onClose={() => {
                setShowCreationModal(false);
                refetch();
              }}
            />
            <Button
              size={"xs"}
              color={"success"}
              onClick={() => setShowCreationModal(true)}
            >
              Utwórz zawody
            </Button>
            <div className="h-screen">
              <Table className="h-full">
                <Table.Head>
                  <Table.HeadCell>Nazwa</Table.HeadCell>
                  <Table.HeadCell>Start</Table.HeadCell>
                  <Table.HeadCell>Koniec</Table.HeadCell>
                  <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                {!isFetching && data ? (
                  <Table.Body>
                    {data.map((contest) => (
                      <Table.Row className="w-full bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{contest.name}</Table.Cell>
                        <Table.Cell>
                          {moment(contest.startDate).toDate().toLocaleString()}
                        </Table.Cell>
                        <Table.Cell>
                          {moment(contest.endDate).toDate().toLocaleString()}
                        </Table.Cell>
                        <Table.Cell>
                          <Popover
                            aria-labelledby="default-popover"
                            content={
                              <div className="flex justify-center">
                                <ListGroup className="w-32">
                                  <ListGroup.Item
                                    onClick={() => {
                                      navigate(`/contests/${contest.id}/edit`);
                                    }}
                                    icon={HiPencilAlt}
                                  >
                                    Edytuj
                                  </ListGroup.Item>
                                  <ListGroup.Item
                                    onClick={() => {}}
                                    icon={HiEye}
                                  >
                                    Wyniki
                                  </ListGroup.Item>
                                  <ListGroup.Item
                                    onClick={() =>
                                      apiClient.contests
                                        .remove(contest.id)
                                        .then(() => refetch())
                                    }
                                    icon={HiOutlineTrash}
                                  >
                                    Usuń
                                  </ListGroup.Item>
                                </ListGroup>
                              </div>
                            }
                          >
                            <Button outline color="gray">
                              <HiDotsVertical />
                            </Button>
                          </Popover>
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
      </div>
    </UserLoggedCheck>
  );
};
