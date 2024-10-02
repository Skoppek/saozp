import edenClient from "../edenClient.ts";

interface LoginCredentials {
  login: string;
  password: string;
}

interface Profile {
  firstName: string;
  lastName: string;
}

const signUp = async (newUserInfo: LoginCredentials & Profile) =>
  await edenClient.auth.sign_up.post(newUserInfo);

const signIn = async (credentials: LoginCredentials) =>
  await edenClient.auth.sign_in.post(credentials);

const logout = async () => await edenClient.auth.logout.delete();

const getLoggedUser = async () =>
  await edenClient.me.get().then((res) => {
    if (!res.data) {
      throw new Error("Unexpected null in response.");
    }
    return res.data;
  });

const changePassword = async (
  token: string,
  newPassword: string,
  login: string,
) =>
  await edenClient.auth.password_reset.post({
    token,
    newPassword,
    login,
  });

export default {
  signUp,
  signIn,
  logout,
  getLoggedUser,
  changePassword,
};
