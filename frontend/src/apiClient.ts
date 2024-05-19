import axios from "axios";
import { NewProblem } from "./shared/interfaces/Problem";
import { TestCase } from "./shared/interfaces/TestCase";
import { Problem } from "./shared/interfaces/Problem";
import { isProblemsEntryArray } from "./shared/interfaces/ProblemEntry";
import { isSubmissionEntryArray } from "./shared/interfaces/SubmissionEntry";
import { isSubmission } from "./shared/interfaces/Submission";
import { isUser } from "./shared/interfaces/User";
import { isProblem } from "./shared/interfaces/Problem";
import { isUserAdminDataArray } from "./shared/interfaces/UserAdminData";

interface LoginCredentials {
  login: string;
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
  import.meta.env.VITE_SAOZP_BACKEND_URL ?? "http://localhost:3000";

const signUp = (newUserInfo: LoginCredentials & Profile) => {
  return axiosInstance.post(`api/sign-up`, newUserInfo, axiosConfig);
};

const signIn = (credentials: LoginCredentials) => {
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
      if (isSubmission(response.data)) {
        return response.data;
      } else {
        throw new Error("Wrong response type. Expected: Submission");
      }
    });
};

interface NewSubmission {
  code: string;
  userTests?: TestCase[];
  isCommit: boolean;
}

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

const getUsersWithProfiles = () => {
  return axiosInstance.get(`api/admin/users`, axiosConfig).then((response) => {
    if (isUserAdminDataArray(response.data)) {
      return response.data;
    } else {
      throw new Error("Wrong response type. Expected: UserAdminData[]");
    }
  });
};

export default {
  signUp,
  signIn,
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
  getUsersWithProfiles,
};
