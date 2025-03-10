import _ from "lodash";
import { mapIfPresent } from "../../shared/mapper.ts";
import edenClient from "../edenClient.ts";
import { NewStage } from "../../shared/interfaces/NewStage.ts";
import {handleFail} from "../wrapper.ts"

interface NewContest {
  name: string;
  description: string;
}

interface Contest extends NewContest {
  ownerId: number;
}

const create = async (newContest: NewContest) =>
  await edenClient.contest.post(newContest);

const getAll = async ({
  participantId,
  ownerId,
}: {
  participantId?: number;
  ownerId?: number;
}) =>
  await edenClient.contest
    .get({
      query: _.omitBy(
        {
          participantId: mapIfPresent(participantId, (a) => a.toString()),
          ownerId: mapIfPresent(ownerId, (a) => a.toString()),
        },
        (v) => v === undefined,
      ),
    })
    .then(handleFail);

const get = async (contestId: number) =>
  await edenClient
    .contest({ contestId })
    .get()
    .then(handleFail);

const put = async (contestId: number, data: Partial<Contest>) =>
  await edenClient.contest({ contestId }).put(data);

const remove = async (contestId: number) =>
  await edenClient.contest({ contestId }).delete();

const getParticipants = async (contestId: number) =>
  await edenClient.contest({ contestId }).users.get().then(handleFail);

const addParticipants = async (
  contestId: number,
  participantIds?: number[],
  groupId?: number,
) =>
  await edenClient.contest({ contestId }).users.put({
    usersIds: participantIds,
    groupId,
  });

const removeParticipants = async (
  contestId: number,
  participantIds?: number[],
) =>
  await edenClient.contest({ contestId }).users.delete({
    usersIds: participantIds,
  });

const addStage = async (contestId: number, newStage: NewStage) => {
  await edenClient.contest({ contestId }).stages.post(newStage);
};

const getStages = async (contestId: number) =>
  await edenClient.contest({ contestId }).stages.get().then(handleFail);

const getStage = async (contestId: number, stageId: number) =>
  await edenClient.contest({ contestId }).stages({ stageId }).get().then(handleFail);

const addProblems = async (
  contestId: number,
  stageId: number,
  problemIds: number[],
) =>
  await edenClient.contest({ contestId }).stages({ stageId }).problems.put(problemIds);

const addBundle = async (
  contestId: number,
  stageId: number,
  bundleId: number,
) =>
  await edenClient.contest({ contestId }).stages({ stageId }).bundle.put({ bundleId });

const removeProblems = async (
  contestId: number,
  stageId: number,
  problemIds: number[],
) =>
  await edenClient.contest({ contestId }).stages({ stageId }).problems.delete(problemIds);

const rerun = async (contestId: number) =>
  await edenClient.contest({ contestId }).rerun.post();

const updateStage = async (
  contestId: number,
  stageId: number,
  stageData: NewStage,
) => await edenClient.contest({ contestId }).stages({ stageId }).put(stageData);

const removeStage = async (contestId: number, stageId: number) =>
  await edenClient.contest({ contestId }).stages({ stageId }).delete();

const getStagesStats = async (contestId: number) =>
  await edenClient.contest({ contestId }).stages.stats.get().then(handleFail);

const getStatsForStage = async (
  contestId: number,
  stageId: number,
  participantId: number,
) =>
  await edenClient.contest({ contestId }).stages({ stageId }).stats.post({ participantId }).then(handleFail);

export default {
  create,
  get,
  getAll,
  put,
  remove,
  getParticipants,
  addParticipants,
  removeParticipants,
  addProblems,
  addBundle,
  addStage,
  getStages,
  getStage,
  getStagesStats,
  getStatsForStage,
  updateStage,
  removeStage,
  removeProblems,
  rerun,
};
