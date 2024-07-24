import { User } from "./User";
import { SubmissionStatus } from "./SubmissionStatus";

export interface SubmissionEntry {
  submissionId: number;
  creator: User | null;
  createdAt?: string;
  status?: SubmissionStatus;
  isCommit: boolean;
}
