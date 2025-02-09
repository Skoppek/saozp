import edenClient from "../edenClient.ts";
import { handleFail } from "../wrapper.ts";

interface NewGroup {
  name: string;
}

interface UpdateGroup {
  name?: string;
  ownerId?: number;
}

const create = async (newGroup: NewGroup) =>
  await edenClient.group.post(newGroup).then(handleFail);

const getAll = async () =>
  await edenClient.group.get().then(handleFail);

const get = async (groupId: number) =>
  await edenClient.group({ groupId }).get().then(handleFail);

const update = async (groupId: number, updatedGroup: UpdateGroup) =>
  await edenClient.group({ groupId }).put(updatedGroup);

const remove = async (groupId: number) =>
  await edenClient.group({ groupId }).delete();

const addUsers = async (groupId: number, userIds: number[]) =>
  await edenClient.group({ groupId }).users.put({ userIds });

const removeUsers = async (groupId: number, userIds: number[]) =>
  await edenClient.group({ groupId }).users.delete({ userIds });

const getUsers = async (groupId: number) =>
  await edenClient.group({ groupId }).users.get().then(handleFail);

const getAllUsers = async () =>
  await edenClient.all.get().then(handleFail);

export default {
  create,
  getAll,
  get,
  update,
  remove,
  getUsers,
  addUsers,
  removeUsers,
  getAllUsers,
};
