import axios from "axios";
import { NewProblem, Problem, TestCase } from "./shared/interfaces";

interface LoginCredentials {
  email: string;
  password: string;
}

interface Profile {
  firstName: string;
  lastName: string;
}

interface Tests {
  tests: TestCase[];
}

interface SubmissionQuery {
  userId?: number;
  problemId?: number;
}

interface NewSubmission {
  code: string;
  userTests: TestCase[];
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
}

const axiosConfig = {
  withCredentials: true,
};

const axiosInstance = axios;
axiosInstance.defaults.baseURL = `http://localhost:3000`;

const registerUser = (newUserInfo: LoginCredentials & Profile) => {
  return axiosInstance.post(`api/sign-up`, newUserInfo, axiosConfig);
};

const loginUser = (credentials: LoginCredentials) => {
  return axiosInstance.post(`api/sign-in`, credentials, axiosConfig);
};

const logout = () => {
  return axiosInstance.put(`api/logout`, axiosConfig);
};

const isLoggedIn = () => {
  return axiosInstance.get(`api/is-logged`, axiosConfig);
};

const createProblem = (newProblem: NewProblem) => {
  return axiosInstance.post(`api/problem/`, newProblem, axiosConfig);
};

const getAllProblems = () => {
  return axiosInstance.get(`api/problem`, axiosConfig);
};

const getProblemById = (problemId: number) => {
  return axiosInstance.get(`api/problem/${problemId}`, axiosConfig);
};

const updateProblemById = (
  problemId: number,
  problemUpdate: Partial<Omit<Problem, "problemId"> & Tests>,
) => {
  return axiosInstance.put(
    `api/problem/${problemId}`,
    problemUpdate,
    axiosConfig,
  );
};

const deleteProblemByid = (problemId: number) => {
  return axiosInstance.delete(`api/problem/${problemId}`, axiosConfig);
};

const getSubmissions = (query: SubmissionQuery) => {
  return axiosInstance.get(`api/submissions`, {
    ...axiosConfig,
    params: query,
  });
};

const getSubmissionById = (submissionId: number) => {
  return axiosInstance.get(`api/submissions/${submissionId}`, axiosConfig);
};

const submitSolution = (problemId: number, newSubmission: NewSubmission) => {
  return axiosInstance.post(
    `api/problem/${problemId}/submission`,
    newSubmission,
    axiosConfig,
  );
};

const getUserOfCurrentSession = () => {
  return axiosInstance.get(`api/me`, axiosConfig);
};

export default {
  registerUser,
  loginUser,
  logout,
  isLoggedIn,
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblemById,
  deleteProblemByid,
  getSubmissions,
  getSubmissionById,
  submitSolution,
  getUserOfCurrentSession,
};
