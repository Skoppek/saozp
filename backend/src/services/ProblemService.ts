import {
    CreateProblemRequest,
    UpdateProblemRequest,
} from '../bodies/problemRequests';
import { User } from '../model/schemas/userSchema';
import { Profile } from '../model/schemas/profileSchema';
import {
    ProblemCreationError,
    ProblemNotFoundError,
    ProblemUpdateError,
} from '../errors/problemErrors';
import ProblemRepository from '../repository/ProblemRepository';
import { isTestCasesFile } from './TestCasesService';

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

    private getCreator(user: User, profile: Profile) {
        return {
            userId: user.id,
            login: user.login,
            firstName: profile.firstName,
            lastName: profile.lastName,
        };
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

    async getProblemList() {
        return (await this.problemRepository.getProblems())
            .filter((problem) => !problem.problems.isDeactivated)
            .map((problem) => {
                return {
                    problemId: problem.problems.id,
                    name: problem.problems.name,
                    description: problem.problems.description,
                    languageId: problem.problems.languageId,
                    creator: this.getCreator(problem.users, problem.profiles),
                    activeAfter: problem.problems.activeAfter,
                };
            });
    }

    async getProblemDetails(problemId: number, isForSolving: boolean) {
        const problem = await this.fetchProblem(problemId);

        return {
            problemId: problem.id,
            name: problem.name,
            description: problem.description,
            prompt: problem.prompt,
            languageId: problem.languageId,
            baseCode: isForSolving
                ? this.hideCreatorCode(problem.baseCode)
                : problem.baseCode,
            creatorId: problem.creatorId,
            tests: problem.tests,
            activeAfter: problem.activeAfter,
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
