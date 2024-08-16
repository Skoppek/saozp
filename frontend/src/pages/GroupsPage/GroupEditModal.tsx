import { Modal } from "flowbite-react/components/Modal";
import { useEffect, useRef } from "react";
import { Spinner } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient.ts";
import { GroupUsersTable } from "./GroupUsersTable.tsx";
import _ from "lodash";
import { TextInput } from "../../components/inputs/TextInput.tsx";

interface GroupEditModalProps {
  group: {
    name: string;
    id: number;
  };
  show: boolean;
  onClose: () => void;
}

export const GroupEditModal = ({
  group,
  show,
  onClose,
}: GroupEditModalProps) => {
  const {
    data: groupUsers,
    isFetching: isFetchingGroup,
    refetch: refetchGroup,
  } = useQuery({
    queryKey: ["groupUsers"],
    queryFn: () => apiClient.groups.getUsers(group.id),
  });

  const {
    data: allUsers,
    isFetching: isFetchingAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => apiClient.groups.getAllUsers(),
  });

  useEffect(() => {
    if (show) {
      void refetchGroup();
      void refetchAll();
    }
  }, [show, refetchGroup, refetchAll]);

  const changeName = useRef(
    _.debounce(async (value: string) => {
      void apiClient.groups.update(group.id, { name: value });
    }, 1000),
  ).current;

  return (
    <>
      <Modal show={show} onClose={() => onClose()}>
        <Modal.Header>{`Edycja grupy - ${group.name}`}</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <TextInput
              id={"groupName"}
              label={"Nazwa grupy"}
              onChange={changeName}
              defaultValue={group.name}
            />
            <div className={"flex justify-around gap-2"}>
              {!isFetchingAll &&
              allUsers != undefined &&
              groupUsers != undefined ? (
                <GroupUsersTable
                  data={_.differenceBy(allUsers, groupUsers, "userId")}
                  confirmLabel={"Dodaj do grupy"}
                  onConfirm={(users) => {
                    apiClient.groups
                      .addUsers(
                        group.id,
                        users.map((user) => user.userId),
                      )
                      .then(() => {
                        void refetchGroup();
                        void refetchAll();
                      });
                  }}
                />
              ) : (
                <Spinner aria-label="Extra large spinner" size="xl" />
              )}
              {!isFetchingGroup && groupUsers !== undefined ? (
                <GroupUsersTable
                  data={groupUsers}
                  confirmLabel={"Usuń z grupy"}
                  onConfirm={(users) => {
                    apiClient.groups
                      .removeUsers(
                        group.id,
                        users.map((user) => user.userId),
                      )
                      .then(() => {
                        void refetchGroup();
                        void refetchAll();
                      });
                  }}
                />
              ) : (
                <Spinner aria-label="Extra large spinner" size="xl" />
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
