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
  return axiosInstance.post(`/sign-up`, newUserInfo, axiosConfig);
};

const signIn = (credentials: LoginCredentials) => {
  return axiosInstance.post(`/sign-in`, credentials, axiosConfig);
};

const logout = () => {
  return axiosInstance.delete(`/logout`, axiosConfig);
};

const isLoggedIn = () => {
  return axiosInstance.get(`/is-logged`, axiosConfig);
};

const createProblem = (newProblem: NewProblem) => {
  return axiosInstance.post(`/problem/`, newProblem, axiosConfig);
};

const getAllProblems = () => {
  return axiosInstance.get(`/problem`, axiosConfig).then((response) => {
    if (isProblemsEntryArray(response.data)) {
      return response.data;
    } else {
      throw new Error("Wrong response type. Expected: ProblemEntry[]");
    }
  });
};

const getProblemById = (problemId: number, solve?: boolean) => {
  return axiosInstance
    .get(`/problem/${problemId}`, {
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
  return axiosInstance.put(`/problem/${problemId}`, problemUpdate, axiosConfig);
};

const deleteProblemByid = (problemId: number) => {
  return axiosInstance.delete(`/problem/${problemId}`, axiosConfig);
};

const getSubmissions = (query: SubmissionQuery) => {
  return axiosInstance
    .get(`/submissions`, {
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
    .get(`/submissions/${submissionId}`, axiosConfig)
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
    `/problem/${problemId}/submission`,
    newSubmission,
    axiosConfig,
  );
};

const getUserOfCurrentSession = () => {
  return axiosInstance.get(`/me`, axiosConfig).then((response) => {
    if (isUser(response.data)) {
      return response.data;
    } else {
      throw new Error("Wrong response type. Expected: User");
    }
  });
};

const getUsersWithProfiles = () => {
  return axiosInstance.get(`/admin/users`, axiosConfig).then((response) => {
    if (isUserAdminDataArray(response.data)) {
      return response.data;
    } else {
      throw new Error("Wrong response type. Expected: UserAdminData[]");
    }
  });
};

const revokeSession = (sessionId: string) => {
  return axiosInstance.delete(`/admin/session/${sessionId}`, axiosConfig);
};

const promoteToAdmin = (userId: number) => {
  return axiosInstance.post(
    "/admin/",
    {
      userId,
    },
    axiosConfig,
  );
};

const revokeAdmin = (userId: number) => {
  return axiosInstance.delete(`/admin/${userId}`, axiosConfig);
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
  revokeSession,
  promoteToAdmin,
  revokeAdmin,
};
