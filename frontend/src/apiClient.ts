import axios from "axios";

const API_URL = "http://localhost:3000";

interface LoginCredentials {
  email: string;
  password: string;
}

interface Profile {
  firstName: string;
  lastName: string;
}

type NewUserInfo = LoginCredentials & Profile;

const registerUser = (newUserInfo: NewUserInfo) => {
  axios.post(`${API_URL}/sign-up`, newUserInfo);
};

const loginUser = (credentials: LoginCredentials) =>
  axios.post(`${API_URL}/sign-in`, credentials);

const logout = () => {
  axios.put(`${API_URL}/logout`);
};

export default {
  registerUser,
  loginUser,
  logout,
};
