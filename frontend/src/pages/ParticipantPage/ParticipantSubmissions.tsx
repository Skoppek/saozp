import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { useContext } from "react";
import { AuthContext } from "../Root";
import { Spinner, Table, TableBody } from "flowbite-react";

interface ParticipantsSubmissions {
  problemId: number;
  contestId: number;
}

export const ParticipantsSubmissions = ({
  problemId,
  contestId,
}: ParticipantsSubmissions) => {
  const authContext = useContext(AuthContext);

  const { data, isFetching } = useQuery({
    queryKey: ["contest", "problem", problemId, "submissisons"],
    queryFn: () =>
      apiClient.submissions.getMany({
        problemId,
        userId: authContext?.user?.userId,
        contestId,
        commitsOnly: true,
      }),
  });

  return (
    <>
      {data && !isFetching ? (
        !!data.length ? (
          <Table>
            <TableBody>
              {data.map((submission, index) => (
                <Table.Row id={index.toString()}>
                  <Table.Cell>
                    {submission.createdAt?.toLocaleString() ?? ""}
                  </Table.Cell>
                  {/* <Table.Cell>{submission.}</Table.Cell> */}
                </Table.Row>
              ))}
            </TableBody>
          </Table>
        ) : (
          <>Such empty</>
        )
      ) : (
        <Spinner />
      )}
    </>
  );
};
