import { useQuery } from "@tanstack/react-query";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck";
import apiClient from "../../client/apiClient";
import { useContext } from "react";
import { AuthContext } from "../Root";
import { Table } from "flowbite-react/components/Table";
import { Spinner } from "flowbite-react/components/Spinner";

export const ParticipantSection = () => {
  const authContext = useContext(AuthContext);

  const { data, isFetching } = useQuery({
    queryKey: ["participantContests"],
    queryFn: () =>
      apiClient.contests.getAll({ participantId: authContext?.user?.userId }),
    enabled: !!authContext?.user?.userId,
  });

  return (
    <UserLoggedCheck>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4 overflow-x-auto pt-12">
          {data && !isFetching ? (
            <Table>
              <Table.Head>
                <Table.HeadCell>Nazwa</Table.HeadCell>
                <Table.HeadCell>Start</Table.HeadCell>
                <Table.HeadCell>Koniec</Table.HeadCell>
                <Table.HeadCell>Organizator</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {data.map((contest, index) => (
                  <Table.Row id={index.toString()}>
                    <Table.Cell>{contest.name}</Table.Cell>
                    <Table.Cell>
                      {contest.startDate.toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>{contest.endDate.toLocaleString()}</Table.Cell>
                    <Table.Cell>
                      {[contest.owner.firstName, contest.owner.lastName].join(
                        " ",
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </UserLoggedCheck>
  );
};
