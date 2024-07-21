import edenClient from "../edenClient.ts";

interface NewBundle {
  name: string;
}

interface UpdateBundle {
  name?: string;
  ownerId?: number;
}

const create = async (newBundle: NewBundle) =>
  await edenClient.bundle.post(newBundle);

const getAll = async () => await edenClient.bundle.get();

const get = async (bundleId: number) =>
  await edenClient.bundle({ bundleId }).get();

const update = async (bundleId: number, updatedBundle: UpdateBundle) =>
  await edenClient.bundle({ bundleId }).put(updatedBundle);

const remove = async (bundleId: number) =>
  await edenClient.bundle({ bundleId }).delete();

const addUsers = async (bundleId: number, problemIds: number[]) =>
  await edenClient.bundle({ bundleId }).users.put({ problemIds });

const removeUsers = async (bundleId: number, problemIds: number[]) =>
  await edenClient.bundle({ bundleId }).users.delete({ problemIds });

export default {
  create,
  getAll,
  get,
  update,
  remove,
  addUsers,
  removeUsers,
};
