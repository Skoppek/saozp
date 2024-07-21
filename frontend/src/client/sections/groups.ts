import edenClient from "../edenClient.ts";

interface NewGroup {
  name: string;
}

interface UpdateGroup {
  name?: string;
  ownerId?: number;
}

const create = async (newGroup: NewGroup) =>
  await edenClient.group.post(newGroup);

const getAll = async () => await edenClient.group.get();

const get = async (groupId: number) =>
  await edenClient.group({ groupId }).get();

const update = async (groupId: number, updatedGroup: UpdateGroup) =>
  await edenClient.group({ groupId }).put(updatedGroup);

const remove = async (groupId: number) =>
  await edenClient.group({ groupId }).delete();

const addUsers = async (groupId: number, userIds: number[]) =>
  await edenClient.group({ groupId }).users.put({ userIds });

const removeUsers = async (groupId: number, userIds: number[]) =>
  await edenClient.group({ groupId }).users.delete({ userIds });

export default {
  create,
  getAll,
  get,
  update,
  remove,
  addUsers,
  removeUsers,
};
