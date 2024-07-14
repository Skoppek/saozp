import {
    CreateProblemRequest,
    UpdateProblemRequest,
} from '../bodies/problemRequests';
import problemRepository from '../repository/problemRepository';
import { User } from '../model/schemas/userSchema';
import { Profile } from '../model/schemas/profileSchema';
import {
    ProblemCreationError,
    ProblemNotFoundError,
    ProblemUpdateError,
} from '../errors/problemErrors';

export class ProblemService {
    private static async fetchProblem(problemId: number) {
        const problem = await problemRepository.getProblemById(+problemId);
        if (!problem || problem.isDeactivated) {
            throw new ProblemNotFoundError(problemId);
        }
        return problem;
    }

    private static hideCreatorCode(code: string) {
        return (
            code
                .match(/---(.*?)---/gs)
                ?.at(0)
                ?.split('---')
                .join('') ?? code
        );
    }

    private static getCreator(user?: User | null, profile?: Profile | null) {
        return user && profile
            ? {
                  userId: user.id,
                  login: user.login,
                  firstName: profile.firstName,
                  lastName: profile.lastName,
              }
            : undefined;
    }

    async createProblem(data: CreateProblemRequest, creatorId: number) {
        const newProblem = await problemRepository.createProblem({
            name: data.name,
            description: data.description,
            creatorId,
            prompt: data.prompt,
            languageId: data.languageId,
            tests: data.tests,
            baseCode: data.baseCode,
            activeAfter: data.activeAfter,
        });
        if (!newProblem) {
            throw new ProblemCreationError();
        }
    }

    async getProblemList() {
        return (await problemRepository.getProblems())
            .filter((problem) => !problem.problems.isDeactivated)
            .map((problem) => {
                return {
                    problemId: problem.problems.id,
                    name: problem.problems.name,
                    description: problem.problems.description,
                    languageId: problem.problems.languageId,
                    creator: ProblemService.getCreator(
                        problem.users,
                        problem.profiles,
                    ),
                    activeAfter: problem.problems.activeAfter,
                };
            });
    }

    async getProblemDetails(problemId: number, isForSolving: boolean) {
        const problem = await ProblemService.fetchProblem(problemId);

        return {
            problemId: problem.id,
            name: problem.name,
            description: problem.description,
            prompt: problem.prompt,
            languageId: problem.languageId,
            baseCode: isForSolving
                ? ProblemService.hideCreatorCode(problem.baseCode)
                : problem.baseCode,
            creatorId: problem.creatorId,
            tests: problem.tests,
            activeAfter: problem.activeAfter,
        };
    }

    async updateProblem(problemId: number, data: UpdateProblemRequest) {
        const updatedProblem = await problemRepository.updateProblemById(
            problemId,
            {
                name: data.name,
                prompt: data.prompt,
                languageId: data.languageId,
                baseCode: data.baseCode,
                tests: data.tests,
                activeAfter: data.activeAfter,
            },
        );
        if (!updatedProblem) {
            throw new ProblemUpdateError(problemId);
        }
    }

    async deleteProblem(problemId: number) {
        await problemRepository.deleteProblemById(problemId);
    }
}
