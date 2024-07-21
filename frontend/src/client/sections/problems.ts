import edenClient from "../edenClient.ts";
import { Problem } from "../../shared/interfaces/Problem.ts";
import { TestCase } from "../../shared/interfaces/TestCase.ts";

interface Tests {
  tests: TestCase[];
}

const getAll = async () => await edenClient.problem.get();

const get = async (problemId: number, solve?: boolean) =>
  await edenClient
    .problem({
      problemId,
    })
    .get({
      query: {
        solve: Boolean(solve).toString(),
      },
    });

const update = async (
  problemId: number,
  problemUpdate: Partial<Omit<Problem, "problemId"> & Tests>,
) => await edenClient.problem({ problemId }).put(problemUpdate);

const remove = async (problemId: number) =>
  await edenClient.problem({ problemId }).delete();

export default {
  getAll,
  get,
  update,
  remove,
};
