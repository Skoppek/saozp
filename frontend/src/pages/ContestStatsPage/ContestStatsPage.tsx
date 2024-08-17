import { useParams } from "react-router-dom";
import { UserLoggedCheck } from "../../checks/UserLoggedCheck";
import { useNumberParam } from "../../shared/useParam";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { StatsTopSubmissions } from "./StatsTopSubmissions";
import { useState } from "react";
import { LiveSubmissionView } from "./LiveSubmissionView";
import { dateTimeFormat } from "../../shared/constansts";
import moment from "moment";
import { Badge } from "flowbite-react/components/Badge";

export const ContestStatsPage = () => {
  const { id } = useParams();
  const { value: contestIdValue } = useNumberParam({
    param: id,
  });

  const [selected, setSelected] = useState<number | undefined>();

  const { data, isFetching } = useQuery({
    queryKey: ["contest", contestIdValue, "stats"],
    queryFn: () => apiClient.contests.get(contestIdValue!),
    enabled: !!contestIdValue,
  });

  return (
    <UserLoggedCheck>
      <div className="flex flex-col gap-4">
        {data && !isFetching && (
          <div className="flex flex-col items-center gap-4 overflow-x-auto pt-8">
            <div className="flex flex-col items-center gap-2">
              <div className="text-4xl">{data.name}</div>
              <Badge
                color={
                  moment().isBefore(data.endDate)
                    ? moment().isAfter(data.startDate)
                      ? "green"
                      : "blue"
                    : "red"
                }
              >
                {[
                  moment(data.startDate).format(dateTimeFormat),
                  moment(data.endDate).format(dateTimeFormat),
                ].join(" - ")}
              </Badge>
            </div>
            {contestIdValue && (
              <div className="flex gap-4">
                <StatsTopSubmissions
                  contestId={contestIdValue}
                  onProblemOpen={(id) => setSelected(id)}
                />
                {selected && (
                  <LiveSubmissionView
                    contestId={contestIdValue}
                    problemId={selected}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </UserLoggedCheck>
  );
};
