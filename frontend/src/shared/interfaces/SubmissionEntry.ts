import { User } from "./User";
import { SubmissionStatus } from "./SubmissionStatus";

export interface SubmissionEntry {
  submissionId: number;
  creator: User | null;
  createdAt?: Date;
  status?: SubmissionStatus;
  isCommit: boolean;
  rerun?: Date;
}
