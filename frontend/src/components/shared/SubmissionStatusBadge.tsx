import { Badge } from "flowbite-react/components/Badge";
import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry";
import { STATUS_COLORS, STATUS_NAMES, TestStatus } from "../../shared/enums";

interface SubmissionStatusBadgeProps {
  submission: SubmissionEntry;
}

export const SubmissionStatusBadge = ({
  submission,
}: SubmissionStatusBadgeProps) => {
  return (
    <Badge
      size={"xs"}
      color={STATUS_COLORS[submission.status?.id ?? TestStatus.UNKNOWN]}
      className="w-fit"
    >
      {STATUS_NAMES[submission.status?.id ?? TestStatus.UNKNOWN]}
    </Badge>
  );
};
