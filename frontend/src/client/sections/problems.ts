import edenClient from "../edenClient.ts";
import { NewProblem, Problem } from "../../shared/interfaces/Problem.ts";
import { TestCase } from "../../shared/interfaces/TestCase.ts";

interface Tests {
  tests: TestCase[];
}

const validateTests = async (file: FileList) =>
  await edenClient.tests_validation
    .post({
      testsFile: file,
    })
    .then((res) => {
      if (!res.data) {
        throw new Error("Unexpected null in response.");
      }
      return res.data;
    });

const create = async (newProblem: NewProblem) =>
  await edenClient.problem.post(newProblem);

const getAll = async () =>
  await edenClient.problem.get().then((res) => {
    if (!res.data) {
      throw new Error("Unexpected null in response.");
    }
    return res.data;
  });

const get = async (problemId: number, solve?: boolean) =>
  await edenClient
    .problem({
      problemId,
    })
    .get({
      query: {
        solve: Boolean(solve).toString(),
      },
    })
    .then((res) => {
      if (!res.data) {
        throw new Error("Unexpected null in response.");
      }
      return res.data;
    });

const update = async (
  problemId: number,
  problemUpdate: Partial<Omit<Problem, "problemId"> & Tests>,
) => await edenClient.problem({ problemId }).put(problemUpdate);

const remove = async (problemId: number) =>
  await edenClient.problem({ problemId }).delete();

export default {
  create,
  getAll,
  get,
  update,
  remove,
  validateTests,
};
