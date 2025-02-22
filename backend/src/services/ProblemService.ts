import {
    CreateProblemRequest,
    UpdateProblemRequest,
} from '../bodies/problemRequests';
import {
    ProblemCreationError,
    ProblemNotFoundError,
    ProblemUpdateError,
} from '../errors/problemErrors';
import ProblemRepository from '../repository/ProblemRepository';

export class ProblemService {
    private async fetchProblem(problemId: number) {
        const problem = await ProblemRepository.getProblemById(+problemId);
        if (!problem || problem.isDeactivated) {
            throw new ProblemNotFoundError(problemId);
        }
        return problem;
    }

    async createProblem(data: CreateProblemRequest, creatorId: number) {
        const newProblem = await ProblemRepository.createProblem({
            ...data,
            creatorId,
        });

        if (!newProblem) {
            throw new ProblemCreationError();
        }
    }

    async getProblemList(userId: number) {
        return (await ProblemRepository.getProblems())
            .filter((problem) => {
                if (problem.creatorId == userId) {
                    return true;
                }

                return !problem.isContestsOnly;
            })
            .filter((problem) => !problem.isDeactivated)
            .map((problem) => {
                return {
                    problemId: problem.id,
                    name: problem.name,
                    languageId: problem.languageId,
                    creator: problem.creator,
                    contestsOnly: problem.isContestsOnly ? true : undefined,
                };
            });
    }

    async getProblemDetails(
        problemId: number,
    ) {
        const problem = await this.fetchProblem(problemId);

        return {
            problemId: problem.id,
            name: problem.name,
            prompt: problem.prompt,
            languageId: problem.languageId,
            baseCode: problem.baseCode,
            creatorId: problem.creatorId,
            tests: problem.tests,
            isContestsOnly: problem.isContestsOnly ? true : undefined,
        };
    }

    async updateProblem(problemId: number, data: UpdateProblemRequest) {
        const updatedProblem = await ProblemRepository.updateProblemById(
            problemId,
            data,
        );
        if (!updatedProblem) {
            throw new ProblemUpdateError(problemId);
        }
    }

    async deleteProblem(problemId: number) {
        await ProblemRepository.deleteProblemById(problemId);
    }
}
