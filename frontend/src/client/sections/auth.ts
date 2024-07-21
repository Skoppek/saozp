import edenClient from "../edenClient.ts";

interface LoginCredentials {
  login: string;
  password: string;
}

interface Profile {
  firstName: string;
  lastName: string;
}

const signUp = (newUserInfo: LoginCredentials & Profile) => {
  return edenClient.auth.sign_up.post(newUserInfo);
};

const signIn = (credentials: LoginCredentials) => {
  return edenClient.auth.sign_in.post(credentials);
};

const logout = () => {
  return edenClient.auth.logout.delete();
};

const getLoggedUser = () => {
  return edenClient.me.get();
};

export default {
  signUp,
  signIn,
  logout,
  getLoggedUser,
};
