import { Table, Tooltip } from "flowbite-react";
import { ScoreButton } from "./ScoreButton";
import _ from "lodash";
import { displayNames } from "../../shared/functions";
import { useCallback } from "react";

interface Participant {
  firstName: string;
  lastName: string;
  userId: number;
}

interface Result {
  participantId: number;
  result: number;
}

interface Stage {
  results: Result[];
  stage: {
    id: number;
    startDate: Date;
    endDate: Date;
    name: string;
  };
}

export const StatsTable = ({
  participants,
  stages,
}: {
  participants: Participant[];
  stages: Stage[];
}) => {
  const getValue = useCallback(
    (results: Result[], participant: Participant) => {
      return (
        results.find((x) => x.participantId === participant.userId)?.result ?? 0
      );
    },
    [],
  );

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Uczestnik</Table.HeadCell>
        {stages &&
          _(stages)
            .sortBy("stage.startDate")
            .value()
            .map((stage) => (
              <Table.HeadCell>
                <Tooltip content={stage.stage.name}>
                  {_.truncate(stage.stage.name, { length: 8 })}
                </Tooltip>
              </Table.HeadCell>
            ))}
      </Table.Head>
      <Table.Body>
        {participants.map((participant) => (
          <Table.Row>
            <Table.Cell>{displayNames(participant)}</Table.Cell>
            {stages &&
              stages.map((stage) => (
                <Table.Cell>
                  <ScoreButton
                    value={getValue(stage.results, participant)}
                    stageId={stage.stage.id}
                    stageName={stage.stage.name}
                    participantId={participant.userId}
                  />
                </Table.Cell>
              ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
