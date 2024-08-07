import { useQuery } from "@tanstack/react-query";
import { Table } from "flowbite-react/components/Table";
import apiClient from "../../../client/apiClient";
import { Button } from "flowbite-react/components/Button";

interface ContestParticipantsViewProps {
  contestId: number;
}

export const ContestParticipantsView = ({
  contestId,
}: ContestParticipantsViewProps) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["contestEdit", "participants", contestId],
    queryFn: () => apiClient.contests.getParticipants(contestId),
  });

  return (
    <div>
      <Button.Group>
        <Button color="gray">Dodaj uczestnika</Button>
        <Button color="gray">Dodaj grupę</Button>
        <Button color="red">Wyrzuć</Button>
      </Button.Group>
      <Table>
        <Table.Head></Table.Head>
        <Table.Body></Table.Body>
      </Table>
    </div>
  );
};
