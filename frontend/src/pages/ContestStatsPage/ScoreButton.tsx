import { Button } from "flowbite-react/components/Button";
import { useState } from "react";
import { StageStatsModal } from "./StageStatsModal";
import { pointsToColor } from "./StatusColor";

export const ScoreButton = ({
  value,
  stageId,
  stageName,
  participantId,
}: {
  value: number;
  stageId: number;
  stageName: string;
  participantId: number;
}) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button color={pointsToColor(value)} onClick={() => setShow(true)}>
        {value >= 0 ? `${value}%` : "N/A"}
      </Button>
      <StageStatsModal
        show={show}
        onClose={() => setShow(false)}
        stageId={stageId}
        stageName={stageName}
        participantId={participantId}
      />
    </>
  );
};
