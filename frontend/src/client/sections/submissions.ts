import edenClient from "../edenClient.ts";
import { TestCase } from "../../shared/interfaces/TestCase.ts";

interface SubmissionQuery {
  userId?: number;
  problemId?: number;
  commitsOnly?: boolean;
}

interface NewSubmission {
  problemId: number;
  code: string;
  userTests?: TestCase[];
  isCommit: boolean;
}

const submit = async (newSubmission: NewSubmission) =>
  await edenClient.submission.post(newSubmission);

const getMany = async (query: SubmissionQuery) =>
  await edenClient.submission.get({
    query: {
      userId: query.userId ? Number(query.userId).toString() : undefined,
      problemId: query.problemId
        ? Number(query.problemId).toString()
        : undefined,
      commitsOnly: query.commitsOnly
        ? Boolean(query.commitsOnly).toString()
        : undefined,
    },
  });

const get = async (submissionId: number) =>
  await edenClient.submission({ submissionId }).get();

export default {
  getMany,
  get,
  submit,
};
