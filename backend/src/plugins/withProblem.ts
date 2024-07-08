import { Elysia } from 'elysia';
import problemRepository from '../repository/problemRepository';
import { ProblemNotFoundError } from '../errors/problemErrors';

export const withProblem = new Elysia().derive(
    { as: 'scoped' },
    async ({ params: { problemId } }) => {
        const problem = await problemRepository.getProblemById(+problemId);
        if (!problem || problem.isDeactivated) {
            throw new ProblemNotFoundError(problemId);
        }
        return { problem };
    },
);
