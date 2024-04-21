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

const registerUser = (newUserInfo: LoginCredentials & Profile) => {
  return axios.post(`${API_URL}/sign-up`, newUserInfo);
};

const loginUser = (credentials: LoginCredentials) => {
  return axios.post(`${API_URL}/sign-in`, credentials);
};

const logout = () => {
  return axios.put(`${API_URL}/logout`);
};

const createProblem = (newProblem: NewProblem) => {
  return axios.post(`${API_URL}/problem/`, newProblem);
};

const getAllProblems = () => {
  return axios.get(`${API_URL}/problem`);
};

const getProblemById = (problemId: number) => {
  return axios.get(`${API_URL}/problem/${problemId}`);
};

const updateProblemById = (
  problemId: number,
  problemUpdate: Partial<Omit<ProblemDetails, "problemId"> & Tests>,
) => {
  return axios.put(`${API_URL}/problem/${problemId}`, problemUpdate);
};

const deleteProblemByid = (problemId: number) => {
  return axios.delete(`${API_URL}/problem/${problemId}`);
};

const getSubmissions = (query: SubmissionQuery) => {
  return axios.get(`${API_URL}/submissions`, { params: query });
};

const getSubmissionById = (submissionId: number) => {
  return axios.get(`${API_URL}/submissions/${submissionId}`);
};

interface NewSubmission {
  code: string;
  userTests: TestData[];
}

const submitSolution = (problemId: number, newSubmission: NewSubmission) => {
  return axios.post(
    `${API_URL}/problem/${problemId}/submission`,
    newSubmission,
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
