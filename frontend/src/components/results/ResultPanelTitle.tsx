import { Badge } from "flowbite-react/components/Badge";
import { SubmissionEntry } from "../../shared/interfaces";
import { STATUS_COLORS, STATUS_NAMES, TestStatus } from "../../shared/enums";
import { HiFlag } from "react-icons/hi";

interface ResultPanelTitleProps {
  submission: SubmissionEntry;
  showAuthor?: boolean;
  showCommitFlag?: boolean;
}

export const ResultPanelTitle = ({
  submission,
  showAuthor,
  showCommitFlag,
}: ResultPanelTitleProps) => {
  return (
    <div className="flex gap-8">
      {submission.createdAt ?? ""}
      <Badge
        size={"sm"}
        color={STATUS_COLORS[submission.status?.id ?? TestStatus.UNKNOWN]}
      >
        {STATUS_NAMES[submission.status?.id ?? TestStatus.UNKNOWN]}
      </Badge>
      {showCommitFlag && !!submission.isCommit && (
        <HiFlag className="size-6 text-orange-400" />
      )}
      {showAuthor && (
        <div className="rounded-lg border border-gray-200 px-2 shadow-md dark:border-gray-700">
          {`${submission.creator?.firstName} ${submission.creator?.lastName}`}
        </div>
      )}
    </div>
  );
};
