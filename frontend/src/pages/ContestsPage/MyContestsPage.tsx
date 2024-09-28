import { useQuery } from "@tanstack/react-query";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck.tsx";
import apiClient from "../../client/apiClient.ts";
import { Table } from "flowbite-react/components/Table";
import { Button, ListGroup, Popover, Spinner } from "flowbite-react";
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
import { TextInput } from "../../components/inputs/TextInput.tsx";
import { ContestInfoForm } from "./ContestInfoForm.tsx";

const ContestOptions = ({
  onScore,
  onEdit,
  onDelete,
}: {
  onScore: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <Popover
      aria-labelledby="default-popover"
      content={
        <div className="flex justify-center">
          <ListGroup className="w-32">
            <ListGroup.Item onClick={onScore} icon={HiEye}>
              Wyniki
            </ListGroup.Item>
            <ListGroup.Item onClick={onEdit} icon={HiPencilAlt}>
              Edytuj
            </ListGroup.Item>
            <ListGroup.Item onClick={onDelete} icon={HiOutlineTrash}>
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
  );
};

export const MyContestsPage = () => {
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [nameFilter, setNameFilter] = useState("");

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["allContests", authContext?.user?.userId],
    queryFn: () =>
      apiClient.contests.getAll({ ownerId: authContext?.user?.userId }),
    enabled: !!authContext?.user?.userId,
  });

  return (
    <UserLoggedCheck>
      <div className="flex flex-col justify-center gap-4 overflow-x-auto pt-12 w-1/2">
        <ContestCreateModal
          show={showCreationModal}
          onClose={() => {
            setShowCreationModal(false);
            void refetch();
          }}
        />
        <div className="flex justify-between w-full gap-2">
          <TextInput
            className="w-4/5"
            placeholder="Szukaj po nazwie"
            type="text"
            id={"contestFilter"}
            onChange={(value) => setNameFilter(value.toLowerCase())}
          />
          <ContestInfoForm
            submitLabel="Dodaj zawody"
            onSubmit={(value) => {
              apiClient.contests.create(value);
              refetch();
            }}
          />
        </div>
        <div className="h-screen">
          <Table className="h-full">
            <Table.Head>
              <Table.HeadCell>Nazwa</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            {!isFetching && data ? (
              <Table.Body>
                {data
                  .filter((contest) =>
                    contest.name.toLowerCase().includes(nameFilter),
                  )
                  .map((contest) => (
                    <Table.Row className="w-full bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{contest.name}</Table.Cell>
                      <Table.Cell className="flex justify-end">
                        <ContestOptions
                          onScore={() => {
                            navigate(`/contests/${contest.id}/stats`);
                          }}
                          onEdit={() => {
                            navigate(`/contests/${contest.id}/edit`);
                          }}
                          onDelete={() =>
                            apiClient.contests
                              .remove(contest.id)
                              .then(() => refetch())
                          }
                        />
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
    </UserLoggedCheck>
  );
};
