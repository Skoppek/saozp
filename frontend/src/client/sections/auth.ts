import edenClient from "../edenClient.ts";
import { handleFail } from "../wrapper.ts";

interface LoginCredentials {
  login: string;
  password: string;
}

interface Profile {
  firstName: string;
  lastName: string;
}

interface ResetPasswordData extends LoginCredentials {
  token: string;
}

const signUp = async (newUserInfo: LoginCredentials & Profile) =>
  await edenClient.auth.sign_up.post(newUserInfo);

const signIn = async (credentials: LoginCredentials) =>
  await edenClient.auth.sign_in.post(credentials);

const logout = async () =>
  await edenClient.auth.logout.delete();

const getLoggedUser = async () =>
  await edenClient.me.get().then(handleFail);

const changePassword = async (data: ResetPasswordData
) =>
  await edenClient.auth.password_reset.post(data);

export default {
  signUp,
  signIn,
  logout,
  getLoggedUser,
  changePassword,
};
