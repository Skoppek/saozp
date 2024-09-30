import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { TestStatus } from "../../shared/enums";
import moment from "moment";
import { dateTimeFormat } from "../../shared/constansts";
import { Spinner } from "flowbite-react";
import { TopStatPanel } from "./TopStatPanel";

interface StatsTopSubmissionsDetailsProps {
  problemId: number;
  contestId: number;
}

const fetchTopSubmissions = async (problemId: number, contestId: number) => {
  const all = await apiClient.submissions.getMany({
    problemId,
    stageId: contestId,
    commitsOnly: true,
  });

  const accepted = all.filter(
    (submisison) => submisison.status?.id === TestStatus.ACCEPTED,
  );

  const details = await Promise.all(
    accepted.map((submission) =>
      apiClient.submissions.get(submission.submissionId),
    ),
  );

  const earliest = details
    .sort((a, b) => (moment(a.createdAt).isBefore(b.createdAt) ? 1 : 0))
    .at(0);

  const bestMemory = details
    .sort((a, b) =>
      (a.result.averageMemory ?? 0 <= (b.result.averageMemory ?? 0)) ? 1 : 0,
    )
    .at(0);

  const bestTime = details
    .sort((a, b) =>
      (a.result.averageTime ?? 0) <= (b.result.averageTime ?? 0) ? 1 : 0,
    )
    .at(0);

  return {
    earliest,
    bestMemory,
    bestTime,
  };
};

export const StatsTopSubmissionsDetails = ({
  problemId,
  contestId,
}: StatsTopSubmissionsDetailsProps) => {
  const { data, isFetching } = useQuery({
    queryKey: ["contest", "problem", problemId, "top"],
    queryFn: () => fetchTopSubmissions(problemId, contestId),
  });

  return (
    <>
      {data && !isFetching ? (
        <div className="flex flex-col gap-2">
          <TopStatPanel
            label={"Najwcześniej zgłoszone rozwiązanie"}
            value={
              data?.earliest?.createdAt
                ? moment(data?.earliest?.createdAt).format(dateTimeFormat)
                : ""
            }
            creator={data.bestMemory?.creator}
          />
          <TopStatPanel
            label={"Najmniejsze zużycie pamięci"}
            value={data?.bestMemory?.result.averageMemory ?? 0}
            creator={data.bestMemory?.creator}
          />
          <TopStatPanel
            label={"Najszybsze rozwiązanie"}
            value={data?.bestTime?.result.averageTime ?? 0}
            creator={data.bestMemory?.creator}
          />
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};
