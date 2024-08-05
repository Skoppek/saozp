import edenClient from "../edenClient.ts";

interface NewContest {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

interface Contest extends NewContest {
  ownerId: number;
}

const create = async (newContest: NewContest) =>
  await edenClient.contest.post(newContest);

const getAll = async () =>
  await edenClient.contest.get().then((res) => {
    if (!res.data) {
      throw new Error("Unexpected null in response.");
    }
    return res.data;
  });

const get = async (contestId: number) =>
  await edenClient
    .contest({ id: contestId })
    .get()
    .then((res) => {
      if (!res.data) {
        throw new Error("Unexpected null in response.");
      }
      return res.data;
    });

const put = async (contestId: number, data: Partial<Contest>) =>
  await edenClient.contest({ id: contestId }).put(data);

const remove = async (contestId: number) =>
  await edenClient.contest({ id: contestId }).delete();

const getParticipants = async (contestId: number) =>
  await edenClient.contest({ id: contestId }).users.get();

const addParticipants = async (
  contestId: number,
  participantIds?: number[],
  groupId?: number,
) =>
  await edenClient.contest({ id: contestId }).users.put({
    usersIds: participantIds,
    groupId,
  });

const removeParticipants = async (
  contestId: number,
  participantIds?: number[],
) =>
  await edenClient.contest({ id: contestId }).users.delete({
    usersIds: participantIds,
  });

const getProblems = async (contestId: number) =>
  await edenClient.contest({ id: contestId }).problems.get();

const addProblems = async (
  contestId: number,
  participantIds?: number[],
  bundleId?: number,
) =>
  await edenClient.contest({ id: contestId }).problems.put({
    problemIds: participantIds,
    bundleId: bundleId,
  });

const removeProblems = async (contestId: number, participantIds?: number[]) =>
  await edenClient.contest({ id: contestId }).problems.delete({
    problemIds: participantIds,
  });

export default {
  create,
  get,
  getAll,
  put,
  remove,
  getParticipants,
  addParticipants,
  removeParticipants,
  getProblems,
  addProblems,
  removeProblems
}