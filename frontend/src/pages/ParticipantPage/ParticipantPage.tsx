import { useQuery } from "@tanstack/react-query";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck";
import apiClient from "../../client/apiClient";
import { useContext, useState } from "react";
import { AuthContext } from "../Root";
import { Table } from "flowbite-react/components/Table";
import { Spinner } from "flowbite-react/components/Spinner";
import { Button } from "flowbite-react/components/Button";
import { HiChevronRight } from "react-icons/hi";
import { ParticipantProblemsList } from "./ParticipantProblemsList";
import moment from "moment";
import { dateTimeFormat } from "../../shared/constansts";
import { TextInput } from "../../components/inputs/TextInput";

export const ParticipantPage = () => {
  const authContext = useContext(AuthContext);

  const [contestId, setContestId] = useState<number | undefined>();
  const [nameFilter, setNameFilter] = useState("");

  const { data, isFetching, error } = useQuery({
    queryKey: ["participantContests"],
    queryFn: () =>
      apiClient.contests.getAll({ participantId: authContext?.user?.userId }),
    enabled: !!authContext?.user?.userId,
  });

  return (
    <UserLoggedCheck>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4 overflow-x-auto pt-12">
          <div className="flex flex-col gap-2 w-1/2">
            <TextInput
              className="w-full"
              placeholder="Szukaj po nazwie"
              type="text"
              id={"contestsFilter"}
              onChange={(value) => setNameFilter(value.toLowerCase())}
            />
            {data && !isFetching ? (
              <Table>
                <Table.Head>
                  <Table.HeadCell>Nazwa</Table.HeadCell>
                  <Table.HeadCell>Start</Table.HeadCell>
                  <Table.HeadCell>Koniec</Table.HeadCell>
                  <Table.HeadCell>Organizator</Table.HeadCell>
                  <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {data
                    .filter((contest) =>
                      contest.name.toLowerCase().includes(nameFilter),
                    )
                    .map((contest, index) => (
                      <Table.Row id={index.toString()}>
                        <Table.Cell>{contest.name}</Table.Cell>
                        <Table.Cell>
                          {moment(contest.startDate).format(dateTimeFormat)}
                        </Table.Cell>
                        <Table.Cell>
                          {moment(contest.endDate).format(dateTimeFormat)}
                        </Table.Cell>
                        <Table.Cell>
                          {[
                            contest.owner.firstName,
                            contest.owner.lastName,
                          ].join(" ")}
                        </Table.Cell>
                        <Table.Cell>
                          <Button onClick={() => setContestId(contest.id)}>
                            <HiChevronRight />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            ) : (
              <Spinner />
            )}
          </div>
          {contestId && <ParticipantProblemsList contestId={contestId} />}
        </div>
      </div>
    </UserLoggedCheck>
  );
};
