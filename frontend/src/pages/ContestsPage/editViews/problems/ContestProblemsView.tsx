// import { useQuery } from "@tanstack/react-query";
// import { Table } from "flowbite-react/components/Table";
// import apiClient from "../../../client/apiClient";
// import { Button } from "flowbite-react/components/Button";

// interface ContestProblemsViewProps {
//   contestId: number;
// }

// export const ContestProblemsView = ({
//   contestId,
// }: ContestProblemsViewProps) => {
//   // const { data, isFetching, refetch } = useQuery({
//   //   queryKey: ["contestEdit", "problems", contestId],
//   //   queryFn: () => apiClient.contests.getProblems(contestId ?? -1),
//   // });

//   return (
//     <div>
//       <Button.Group>
//         <Button color="gray">Dodaj problem</Button>
//         <Button color="gray">Dodaj paczkę</Button>
//         <Button color="red">Usuń</Button>
//       </Button.Group>
//       <Table>
//         <Table.Head></Table.Head>
//         <Table.Body></Table.Body>
//       </Table>
//     </div>
//   );
// };
