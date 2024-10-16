import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry";
import { HiFlag } from "react-icons/hi";
import { SubmissionStatusBadge } from "../SubmissionStatusBadge";
import { RerunIcon } from "../RerunIcon";

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
      {submission.createdAt && (
        <>{new Date(submission.createdAt).toLocaleString()}</>
      )}
      <SubmissionStatusBadge submission={submission} />
      {submission.rerun && <RerunIcon rerunDate={submission.rerun} />}
      {showCommitFlag && submission.isCommit && (
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
