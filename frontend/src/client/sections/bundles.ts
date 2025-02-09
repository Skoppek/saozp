import edenClient from "../edenClient.ts";
import { handleFail } from "../wrapper.ts";

interface NewBundle {
  name: string;
}

interface UpdateBundle {
  name?: string;
  ownerId?: number;
}

const create = async (newBundle: NewBundle) =>
  await edenClient.bundle.post(newBundle);

const getAll = async () =>
  await edenClient.bundle.get().then(handleFail);

const get = async (bundleId: number) =>
  await edenClient.bundle({ bundleId }).get().then(handleFail);

const update = async (bundleId: number, updatedBundle: UpdateBundle) =>
  await edenClient.bundle({ bundleId }).put(updatedBundle);

const remove = async (bundleId: number) =>
  await edenClient.bundle({ bundleId }).delete();

const addProblems = async (bundleId: number, problemIds: number[]) =>
  await edenClient.bundle({ bundleId }).problems.put({ problemIds });

const removeProblems = async (bundleId: number, problemIds: number[]) =>
  await edenClient.bundle({ bundleId }).problems.delete({ problemIds });

const getProblems = async (bundleId: number) =>
  await edenClient.bundle({ bundleId }).problems.get().then(handleFail);

export default {
  create,
  getAll,
  get,
  update,
  remove,
  getProblems,
  addProblems,
  removeProblems,
};
