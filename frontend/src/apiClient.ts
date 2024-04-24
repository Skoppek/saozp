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

const axiosConfig = {
  withCredentials: true,
};

const registerUser = (newUserInfo: LoginCredentials & Profile) => {
  return axios.post(`${API_URL}/sign-up`, newUserInfo, axiosConfig);
};

const loginUser = (credentials: LoginCredentials) => {
  return axios.post(`${API_URL}/sign-in`, credentials, axiosConfig);
};

const logout = () => {
  return axios.put(`${API_URL}/logout`, axiosConfig);
};

const createProblem = (newProblem: NewProblem) => {
  return axios.post(`${API_URL}/problem/`, newProblem, axiosConfig);
};

const getAllProblems = () => {
  return axios.get(`${API_URL}/problem`, axiosConfig);
};

const getProblemById = (problemId: number) => {
  return axios.get(`${API_URL}/problem/${problemId}`, axiosConfig);
};

const updateProblemById = (
  problemId: number,
  problemUpdate: Partial<Omit<ProblemDetails, "problemId"> & Tests>,
) => {
  return axios.put(
    `${API_URL}/problem/${problemId}`,
    problemUpdate,
    axiosConfig,
  );
};

const deleteProblemByid = (problemId: number) => {
  return axios.delete(`${API_URL}/problem/${problemId}`, axiosConfig);
};

const getSubmissions = (query: SubmissionQuery) => {
  return axios.get(`${API_URL}/submissions`, { ...axiosConfig, params: query });
};

const getSubmissionById = (submissionId: number) => {
  return axios.get(`${API_URL}/submissions/${submissionId}`, axiosConfig);
};

interface NewSubmission {
  code: string;
  userTests: TestData[];
}

const submitSolution = (problemId: number, newSubmission: NewSubmission) => {
  return axios.post(
    `${API_URL}/problem/${problemId}/submission`,
    newSubmission,
    axiosConfig,
  );
};

export default {
  registerUser,
  loginUser,
  logout,
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblemById,
  deleteProblemByid,
  getSubmissions,
  getSubmissionById,
  submitSolution,
};
