import { SubmissionEntry } from "../../shared/interfaces/SubmissionEntry";
import { SubmissionStatusBadge } from "../shared/SubmissionStatusBadge";
import { RerunIcon } from "../RerunIcon";

interface ResultPanelTitleProps {
  submission: SubmissionEntry;
  showAuthor?: boolean;
}

export const ResultPanelTitle = ({
  submission,
  showAuthor,
}: ResultPanelTitleProps) => {
  return (
    <div className="flex gap-8">
      {submission.createdAt && (
        <>{new Date(submission.createdAt).toLocaleString()}</>
      )}
      <SubmissionStatusBadge submission={submission} />
      {submission.rerun && <RerunIcon rerunDate={submission.rerun} />}
      {showAuthor && (
        <div className="rounded-lg border border-gray-200 px-2 shadow-md dark:border-gray-700">
          {`${submission.creator?.firstName} ${submission.creator?.lastName}`}
        </div>
      )}
    </div>
  );
};
