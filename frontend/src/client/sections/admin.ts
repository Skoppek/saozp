import edenClient from "../edenClient.ts";
import { handleFail } from "../wrapper.ts";

const getUsers = async () =>
  await edenClient.admin.users.get().then(handleFail);

const logoutUser = async (sessionId: string) =>
  await edenClient.admin.session({ id: sessionId }).delete();

const promote = async (userId: number) =>
  await edenClient.admin.post({ userId });

const demote = async (userId: number) =>
  await edenClient.admin({ userId }).delete();

const resetPassword = async (userId: number) =>
  await edenClient.admin({ userId }).password_reset.post().then(handleFail);

export default {
  getUsers,
  logoutUser,
  promote,
  demote,
  resetPassword,
};
