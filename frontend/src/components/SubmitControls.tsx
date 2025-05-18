import { useQuery } from "@tanstack/react-query";
import apiClient from "../client/apiClient";
import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import moment from "moment";
import { Alert, Button, Spinner } from "flowbite-react";
import { ContestTimerAlert } from "./ContestTimerAlert";

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
}) => {
  const { data, isFetching } = useQuery({
    queryKey: ["submission", "contest", contestId],
    queryFn: () =>
      contestId && stageId ?
        apiClient.contests.getStage(contestId, stageId)
      : undefined,
    enabled: !_.isUndefined(contestId),
  });

  const contestLock = useMemo<boolean | undefined>(() => {
    if (isFetching) return undefined;
    if (!data) return false;
    return moment().isSameOrAfter(data.endDate);
  }, [isFetching, data]);

  const [timeLeft, setTimeLeft] = useState<number>();

  useEffect(() => {
    setTimeout(() => {
      const t = moment(data?.endDate).diff(moment());
      setTimeLeft(t);
    }, 1000);
  }, [data?.endDate])

  return (
    <div className="flex w-full gap-4">
      {_.isUndefined(contestLock) ?
        <Spinner />
      : contestLock ?
        <Alert className="w-full" color={"warning"}>
          <div>
            Zgłaszanie rozwiązań w ramach tych zawodów nie jest już możliwe.
          </div>
        </Alert>
      : <div className="flex w-full flex-col gap-2">
          {!!timeLeft && <ContestTimerAlert timeLeft={timeLeft} />}
          <div className="flex gap-2">
            <Button
              className="w-full"
              onClick={() => submitFn(false)}
              disabled={!!timeLeft && timeLeft <= 0}
            >
              {isWaiting ?
                <Spinner />
              : "Wyślij"}
            </Button>
          </div>
        </div>
      }
    </div>
  );
};
