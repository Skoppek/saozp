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
    private problemRepository = new ProblemRepository();

    private async fetchProblem(problemId: number) {
        const problem = await this.problemRepository.getProblemById(+problemId);
        if (!problem || problem.isDeactivated) {
            throw new ProblemNotFoundError(problemId);
        }
        return problem;
    }

    private hideCreatorCode(code: string) {
        return (
            code
                .match(/---(.*?)---/gs)
                ?.at(0)
                ?.split('---')
                .join('') ?? code
        );
    }

    async createProblem(data: CreateProblemRequest, creatorId: number) {
        const newProblem = await this.problemRepository.createProblem({
            ...data,
            creatorId,
        });

        if (!newProblem) {
            throw new ProblemCreationError();
        }
    }

    async getProblemList(userId: number) {
        return (await this.problemRepository.getProblems())
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
        userId: number,
        problemId: number,
        isForSolving: boolean,
    ) {
        const problem = await this.fetchProblem(problemId);

        if (
            problem.isContestsOnly &&
            userId != problem.creatorId &&
            !isForSolving
        ) {
            throw new Error('No access');
        }

        return {
            problemId: problem.id,
            name: problem.name,
            prompt: problem.prompt,
            languageId: problem.languageId,
            baseCode: isForSolving
                ? this.hideCreatorCode(problem.baseCode)
                : problem.baseCode,
            creatorId: problem.creatorId,
            tests: problem.tests,
            isContestsOnly: problem.isContestsOnly ? true : undefined,
        };
    }

    async updateProblem(problemId: number, data: UpdateProblemRequest) {
        const updatedProblem = await this.problemRepository.updateProblemById(
            problemId,
            data,
        );
        if (!updatedProblem) {
            throw new ProblemUpdateError(problemId);
        }
    }

    async deleteProblem(problemId: number) {
        await this.problemRepository.deleteProblemById(problemId);
    }
}
