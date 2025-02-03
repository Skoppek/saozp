import edenClient from "../edenClient.ts";
import { TestCase } from "../../shared/interfaces/TestCase.ts";
import { mapIfPresent } from "../../shared/mapper.ts";
import _ from "lodash";
import { handleFail } from "../wrapper.ts";

interface SubmissionQuery {
  userId?: number;
  problemId?: number;
  commitsOnly?: boolean;
  stageId?: number;
}

interface NewSubmission {
  problemId: number;
  code: string;
  userTests?: TestCase[];
  isCommit: boolean;
  createdAt?: Date;
  stageId?: number;
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
          stageId: mapIfPresent(query.stageId, (id) => id.toString()),
          commitsOnly: mapIfPresent(query.commitsOnly, (a) => a.toString()),
        },
        (x) => x == undefined,
      ),
    })
    .then(handleFail);

const get = async (submissionId: number) =>
  await edenClient.submission({ submissionId }).get().then(handleFail);

export default {
  getMany,
  get,
  submit,
};
