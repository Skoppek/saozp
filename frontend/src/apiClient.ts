import axios from "axios";
import { NewProblem, Problem, TestCase } from "./shared/interfaces";
import {
  isProblem,
  isProblemsEntryArray,
  isSubmission,
  isSubmissionEntryArray,
  isUser,
} from "./shared/typeGuards";
import { NewSubmission } from "./shared/interfaces";

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
  commitsOnly?: boolean;
}

const axiosConfig = {
  withCredentials: true,
};

const axiosInstance = axios;
axiosInstance.defaults.baseURL =
  process.env.SAOZP_BACKEND_URL ?? "http://localhost:3000";

const registerUser = (newUserInfo: LoginCredentials & Profile) => {
  return axiosInstance.post(`api/sign-up`, newUserInfo, axiosConfig);
};

const loginUser = (credentials: LoginCredentials) => {
  return axiosInstance.post(`api/sign-in`, credentials, axiosConfig);
};

const logout = () => {
  return axiosInstance.delete(`api/logout`, axiosConfig);
};

const isLoggedIn = () => {
  return axiosInstance.get(`api/is-logged`, axiosConfig);
};

const createProblem = (newProblem: NewProblem) => {
  return axiosInstance.post(`api/problem/`, newProblem, axiosConfig);
};

const getAllProblems = () => {
  return axiosInstance.get(`api/problem`, axiosConfig).then((response) => {
    if (isProblemsEntryArray(response.data)) {
      return response.data;
    } else {
      throw new Error("Wrong response type. Expected: ProblemEntry[]");
    }
  });
};

const getProblemById = (problemId: number, solve?: boolean) => {
  return axiosInstance
    .get(`api/problem/${problemId}`, {
      ...axiosConfig,
      params: {
        solve: solve,
      },
    })
    .then((response) => {
      if (isProblem(response.data)) {
        return response.data;
      } else {
        throw new Error("Wrong response type. Expected: Problem[]");
      }
    });
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
  return axiosInstance
    .get(`api/submissions`, {
      ...axiosConfig,
      params: query,
    })
    .then((response) => {
      if (isSubmissionEntryArray(response.data)) {
        return response.data;
      } else {
        throw new Error("Wrong response type. Expected: SubmissionEntry[]");
      }
    });
};

const getSubmissionById = (submissionId: number) => {
  return axiosInstance
    .get(`api/submissions/${submissionId}`, axiosConfig)
    .then((response) => {
      console.log(response.data);
      if (isSubmission(response.data)) {
        return response.data;
      } else {
        throw new Error("Wrong response type. Expected: Submission");
      }
    });
};

const submitSolution = (problemId: number, newSubmission: NewSubmission) => {
  return axiosInstance.post(
    `api/problem/${problemId}/submission`,
    newSubmission,
    axiosConfig,
  );
};

const getUserOfCurrentSession = () => {
  return axiosInstance.get(`api/me`, axiosConfig).then((response) => {
    if (isUser(response.data)) {
      return response.data;
    } else {
      throw new Error("Wrong response type. Expected: User");
    }
  });
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
