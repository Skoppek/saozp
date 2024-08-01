import edenClient from "../edenClient.ts";

interface NewGroup {
  name: string;
}

interface UpdateGroup {
  name?: string;
  ownerId?: number;
}

const create = async (newGroup: NewGroup) =>
  await edenClient.group.post(newGroup).then((res) => {
    if (!res.data) {
      throw new Error("Unexpected null in response.");
    }
    return res.data;
  });

const getAll = async () =>
  await edenClient.group.get().then((res) => {
    if (!res.data) {
      throw new Error("Unexpected null in response.");
    }
    return res.data;
  });

const get = async (groupId: number) =>
  await edenClient
    .group({ groupId })
    .get()
    .then((res) => {
      if (!res.data) {
        throw new Error("Unexpected null in response.");
      }
      return res.data;
    });

const update = async (groupId: number, updatedGroup: UpdateGroup) =>
  await edenClient.group({ groupId }).put(updatedGroup);

const remove = async (groupId: number) =>
  await edenClient.group({ groupId }).delete();

const addUsers = async (groupId: number, userIds: number[]) =>
  await edenClient.group({ groupId }).users.put({ userIds });

const removeUsers = async (groupId: number, userIds: number[]) =>
  await edenClient.group({ groupId }).users.delete({ userIds });

const getUsers = async (groupId: number) =>
  await edenClient
    .group({ groupId })
    .users.get()
    .then((res) => {
      if (!res.data) {
        throw new Error("Unexpected null in response.");
      }
      return res.data;
    });

const getAllUsers = async () =>
  await edenClient.all.get().then((res) => {
    if (!res.data) {
      throw new Error("Unexpected null in response.");
    }
    return res.data;
  });

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
