import edenClient from "../edenClient.ts";
import { TestCase } from "../../shared/interfaces/TestCase.ts";
import { mapIfPresent } from "../../shared/mapper.ts";
import _ from "lodash";

interface SubmissionQuery {
  userId?: number;
  problemId?: number;
  commitsOnly?: boolean;
  contestId?: number;
}

interface NewSubmission {
  problemId: number;
  code: string;
  userTests?: TestCase[];
  isCommit: boolean;
  contestId?: number;
}

const submit = async (newSubmission: NewSubmission) =>
  await edenClient.submission.post(newSubmission);

const getMany = async (query: SubmissionQuery) =>
  await edenClient.submission
    .get({
      query: _.omitBy(
        {
          userId: mapIfPresent(query.userId, (id) => id.toString()),
          problemId: mapIfPresent(query.problemId, (id) => id.toString()),
          contestId: mapIfPresent(query.contestId, (id) => id.toString()),
          commitsOnly: mapIfPresent(query.commitsOnly, (a) => a.toString()),
        },
        (x) => x == undefined,
      ),
    })
    .then((res) => {
      if (!res.data) {
        throw new Error("Unexpected null in response.");
      }
      return res.data;
    });

const get = async (submissionId: number) =>
  await edenClient
    .submission({ submissionId })
    .get()
    .then((res) => {
      if (!res.data) {
        throw new Error("Unexpected null in response.");
      }
      return res.data;
    });

export default {
  getMany,
  get,
  submit,
};
