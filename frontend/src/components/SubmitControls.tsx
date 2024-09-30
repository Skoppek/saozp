import { useQuery } from "@tanstack/react-query";
import apiClient from "../client/apiClient";
import { useMemo, useState } from "react";
import _ from "lodash";
import moment from "moment";
import { Alert, Button, Spinner } from "flowbite-react";
import humanizeDuration from "humanize-duration";

export const SubmitControls = ({
  submitFn,
  contestId,
  stageId,
  isWaiting,
}: {
  submitFn: (asTest: boolean) => void;
  contestId?: number;
  stageId?: number;
  isWaiting?: boolean;
  enableTests?: boolean;
}) => {
  const { data, isFetching } = useQuery({
    queryKey: ["submission", "contest", contestId],
    queryFn: () =>
      contestId && stageId
        ? apiClient.contests.getStage(contestId, stageId)
        : undefined,
    enabled: !_.isUndefined(contestId),
  });

  const contestLock = useMemo<boolean | undefined>(() => {
    if (isFetching) return undefined;
    if (!data) return false;
    return moment().isSameOrAfter(data.endDate);
  }, [isFetching, data]);

  const [timeLeft, setTimeLeft] = useState<number>();

  setTimeout(() => {
    const t = moment(data?.endDate).diff(moment());
    setTimeLeft(t);
  }, 1000);

  return (
    <div className="flex w-full gap-4">
      {_.isUndefined(contestLock) ? (
        <Spinner />
      ) : contestLock ? (
        <Alert className="w-full" color={"warning"}>
          <div>
            Zgłaszanie rozwiązań w ramach tych zawodów nie jest już możliwe
          </div>
        </Alert>
      ) : (
        <div className="flex w-full flex-col gap-2">
          {!!timeLeft && (
            <Alert
              className="w-full"
              color={timeLeft > 60000 ? "green" : "warning"}
            >
              {timeLeft > 0 ? (
                <div>
                  Do zamknięcia przyjmowania rozwiązań:{" "}
                  {humanizeDuration(timeLeft - (timeLeft % 1000), {
                    language: "pl",
                  })}
                </div>
              ) : (
                <div>
                  Zgłaszanie rozwiązań w ramach tych zawodów nie jest już
                  możliwe
                </div>
              )}
            </Alert>
          )}
          <div className="flex gap-2">
            <Button
              className="w-full"
              onClick={() => submitFn(false)}
              disabled={!!timeLeft && timeLeft <= 0}
            >
              {isWaiting ? <Spinner /> : "Wyślij"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
