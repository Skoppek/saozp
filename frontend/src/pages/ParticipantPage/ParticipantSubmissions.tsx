import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { useContext } from "react";
import { AuthContext } from "../Root";
import { Spinner, Table, TableBody } from "flowbite-react";
import { SubmissionStatusBadge } from "../../components/SubmissionStatusBadge";
import moment from "moment";
import { dateTimeFormat } from "../../shared/constansts";

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
                <Table.Row id={index.toString()} className="dark:bg-sky-950">
                  <Table.Cell>
                    {moment(submission.createdAt).format(dateTimeFormat)}
                  </Table.Cell>
                  <Table.Cell className="flex justify-end">
                    <SubmissionStatusBadge submission={submission} />
                  </Table.Cell>
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
