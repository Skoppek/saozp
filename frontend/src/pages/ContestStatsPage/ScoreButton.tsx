import { Button } from "flowbite-react/components/Button";
import { useMemo, useState } from "react";
import { StageStatsModal } from "./StageStatsModal";

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

  const color = useMemo(() => {
    if (value < 10) return "failure";
    if (value < 30) return "warning";
    if (value < 75) return "light";
    if (value < 100) return "blue";
    return "success";
  }, [value]);

  return (
    <>
      <Button color={color} onClick={() => setShow(true)}>{`${value}%`}</Button>
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
