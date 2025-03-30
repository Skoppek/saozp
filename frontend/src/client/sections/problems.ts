import edenClient from "../edenClient.ts";
import { NewProblem, Problem } from "../../shared/interfaces/Problem.ts";
import { TestCase } from "../../shared/interfaces/TestCase.ts";
import { handleFail } from "../wrapper.ts";

interface Tests {
  tests: TestCase[];
}

const validateTests = async (file: FileList) =>
  await edenClient.testCases.tests_validation.post({ testsFile: file }).then(handleFail);

const create = async (newProblem: NewProblem) =>
  await edenClient.problem.post(newProblem);

const getAll = async () =>
  await edenClient.problem.get().then(handleFail);

const get = async (problemId: number) =>
  await edenClient.problem({ problemId }).get().then(handleFail);

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
