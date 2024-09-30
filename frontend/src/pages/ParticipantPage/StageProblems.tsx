import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client/apiClient";
import { Spinner } from "flowbite-react/components/Spinner";
import { Accordion, Badge, Button } from "flowbite-react";
import { ParticipantsSubmissions } from "./ParticipantSubmissions";
import { LinkButton } from "../../components/LinkButton";
import moment from "moment";
import { dateTimeFormat } from "../../shared/constansts";
import { displayDateTime } from "../../shared/functions";

export const StageProblems = ({
  contestId,
  stageId,
}: {
  contestId: number;
  stageId: number;
}) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["stage", stageId, "problems"],
    queryFn: () => apiClient.contests.getStage(contestId, stageId),
  });

  return (
    <div className="w-full flex flex-col gap-2">
      <Button onClick={() => refetch()} size="xs" outline>
        Odśwież
      </Button>
      {data && !isFetching ? (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-around gap-2 w-full">
            <Badge size={"sm"} color={"success"}>
              Start: {displayDateTime(data.startDate)}
            </Badge>
            <Badge
              size={"sm"}
              color={moment().isAfter(data.endDate) ? "red" : "warning"}
            >
              Koniec: {displayDateTime(data.endDate)}
            </Badge>
          </div>
          <Accordion collapseAll>
            {data.problems.map((problem) => (
              <Accordion.Panel>
                <Accordion.Title>{problem.name}</Accordion.Title>
                <Accordion.Content>
                  <div className="flex flex-col gap-2 w-full">
                    <LinkButton
                      to={`/contests/${contestId}/stage/${stageId}/problem/${problem.problemId}`}
                      label="Rozwiąż"
                      buttonProps={{
                        size: "xs",
                        disabled: !moment().isBetween(
                          moment(data.startDate),
                          moment(data.endDate),
                        ),
                      }}
                      className="w-full"
                    />
                    <ParticipantsSubmissions
                      problemId={problem.problemId}
                      stageId={stageId}
                    />
                  </div>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
