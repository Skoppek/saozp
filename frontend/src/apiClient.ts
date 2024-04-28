import axios from "axios";

const API_URL = "http://localhost:3000/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface Profile {
  firstName: string;
  lastName: string;
}

const enum LanguageId {
  C = 50,
  CPP = 54,
  CS = 51,
  JAVA_13 = 62,
  PYTHON_3_8_1 = 71,
  TYPESCRIPT_3_7_4 = 74,
}

interface TestData {
  input: string;
  expected: string;
}

interface Tests {
  tests: TestData[];
}

interface BasicProblemData {
  problemId: number;
  name: string;
  description?: string;
  languageId: LanguageId;
}

interface ProblemDetails extends BasicProblemData {
  prompt: string;
  baseCode: string;
  creatorId: number;
}

interface NewProblem
  extends Omit<ProblemDetails, "problemId" | "creatorId">,
    Tests {}

interface SubmissionQuery {
  userId?: number;
  problemId?: number;
}

interface NewSubmission {
  code: string;
  userTests: TestData[];
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
}

const axiosConfig = {
  withCredentials: true,
};

const registerUser = (newUserInfo: LoginCredentials & Profile) => {
  return axios.post(`api/sign-up`, newUserInfo, axiosConfig);
};

const loginUser = (credentials: LoginCredentials) => {
  return axios.post(`api/sign-in`, credentials, axiosConfig);
};

const logout = () => {
  return axios.put(`api/logout`, axiosConfig);
};

const isLoggedIn = () => {
  return axios.get(`api/is-logged`, axiosConfig);
};

const createProblem = (newProblem: NewProblem) => {
  return axios.post(`api/problem/`, newProblem, axiosConfig);
};

const getAllProblems = () => {
  return axios.get(`api/problem`, axiosConfig);
};

const getProblemById = (problemId: number) => {
  return axios.get(`api/problem/${problemId}`, axiosConfig);
};

const updateProblemById = (
  problemId: number,
  problemUpdate: Partial<Omit<ProblemDetails, "problemId"> & Tests>,
) => {
  return axios.put(`api/problem/${problemId}`, problemUpdate, axiosConfig);
};

const deleteProblemByid = (problemId: number) => {
  return axios.delete(`api/problem/${problemId}`, axiosConfig);
};

const getSubmissions = (query: SubmissionQuery) => {
  return axios.get(`api/submissions`, { ...axiosConfig, params: query });
};

const getSubmissionById = (submissionId: number) => {
  return axios.get(`api/submissions/${submissionId}`, axiosConfig);
};

const submitSolution = (problemId: number, newSubmission: NewSubmission) => {
  return axios.post(
    `api/problem/${problemId}/submission`,
    newSubmission,
    axiosConfig,
  );
};

const getUserOfCurrentSession = () => {
  return axios.get(`api/me`, axiosConfig);
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
