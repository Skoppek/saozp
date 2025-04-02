import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { Accordion, Badge, Button, Spinner } from "flowbite-react";
import { InfoCard } from "../../components/InfoCard";
import { HiEyeOff } from "react-icons/hi";
import { StageProblems } from "./StageProblems";
import _ from "lodash";
import { displayDateTime } from "../../shared/functions";
import moment from "moment";

export const ParticipantStagesList = ({ contestId }: { contestId: number }) => {
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["participant", "problems", contestId],
    queryFn: () => apiClient.contests.getStages(contestId),
  });

  return (
    <>
      {data && !isFetching ? (
        <Accordion collapseAll className="w-[500px]">
          {_(data)
            .sortBy("startDate")
            .value()
            .map((stage, index) => (
              <Accordion.Panel id={index.toString()}>
                <Accordion.Title>
                  <div className="flex w-[400px] flex-col items-center gap-2">
                    <div className="text-xl">{stage.name}</div>
                    <div className="flex w-full justify-around gap-2">
                      <Badge size={"sm"} color={"success"}>
                        Start: {displayDateTime(stage.startDate)}
                      </Badge>
                      <Badge
                        size={"sm"}
                        color={
                          moment().isAfter(stage.endDate) ? "red" : "warning"
                        }
                      >
                        Koniec: {displayDateTime(stage.endDate)}
                      </Badge>
                    </div>
                  </div>
                </Accordion.Title>
                <Accordion.Content>
                  <StageProblems contestId={contestId} stageId={stage.id} />
                </Accordion.Content>
              </Accordion.Panel>
            ))}
        </Accordion>
      ) : isError ? (
        <InfoCard>
          <div className="flex flex-col items-center justify-center gap-2">
            <HiEyeOff size={120} />
            <span>Te zawody jeszcze się nie zaczęły</span>
            <Button onClick={() => refetch()}>Odśwież</Button>
          </div>
        </InfoCard>
      ) : (
        <Spinner />
      )}
    </>
  );
};
