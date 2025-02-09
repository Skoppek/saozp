import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { useContext } from "react";
import { Spinner, Table, TableBody } from "flowbite-react";
import { SubmissionStatusBadge } from "../../components/SubmissionStatusBadge";
import moment from "moment";
import { dateTimeFormat } from "../../shared/constansts";
import _ from "lodash";
import { RerunIcon } from "../../components/RerunIcon";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";

interface ParticipantsSubmissions {
  problemId: number;
  stageId: number;
}

export const ParticipantsSubmissions = ({
  problemId,
  stageId,
}: ParticipantsSubmissions) => {
  const authContext = useContext(AuthContext);

  const { data, isFetching } = useQuery({
    queryKey: ["contest", "problem", problemId, "submissisons", stageId],
    queryFn: () =>
      apiClient.submissions.getMany({
        problemId,
        userId: authContext?.user?.userId,
        stageId,
        commitsOnly: true,
      }),
  });

  return (
    <>
      {data && !isFetching ? (
        data.length ? (
          <Table>
            <TableBody>
              {_.chain(data)
                .sortBy("createdAt")
                .reverse()
                .value()
                .map((submission, index) => (
                  <Table.Row id={index.toString()} className="dark:bg-sky-950">
                    <Table.Cell>
                      {moment(submission.createdAt).format(dateTimeFormat)}
                    </Table.Cell>
                    <Table.Cell>
                      {submission.rerun && (
                        <RerunIcon rerunDate={submission.rerun} />
                      )}
                    </Table.Cell>
                    <Table.Cell className="flex justify-end">
                      <SubmissionStatusBadge submission={submission} />
                    </Table.Cell>
                  </Table.Row>
                ))}
            </TableBody>
          </Table>
        ) : (
          <>Brak rozwiązań</>
        )
      ) : (
        <Spinner />
      )}
    </>
  );
};
