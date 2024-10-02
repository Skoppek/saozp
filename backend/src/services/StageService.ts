import { NewStage } from '../model/schemas/stageSchema';
import ProblemRepository from '../repository/ProblemRepository';
import StageRepository from '../repository/StageRepository';

export default class StageService {
    private stageId: number;

    constructor(stageId: number) {
        this.stageId = stageId;
    }

    static async createStage(newStage: NewStage) {
        await StageRepository.createStage(newStage);
    }

    async getDetails() {
        const stage = await StageRepository.getStageById(this.stageId);

        if (!stage) {
            throw new Error(`There's no stage with id: ${this.stageId}`);
        }

        const problems = await ProblemRepository.getProblemsOfStage(
            this.stageId,
        );

        return { ...stage, problems };
    }

    async delete() {
        await StageRepository.deleteContest(this.stageId);
    }

    async update(
        data: Partial<Pick<NewStage, 'name' | 'startDate' | 'endDate'>>,
    ) {
        await StageRepository.updateStage(this.stageId, data);
    }

    async addProblems(problemIds: number[]) {
        await Promise.all(
            problemIds.map((id) =>
                StageRepository.addProblem(this.stageId, id),
            ),
        );
    }

    async addBundle(bundleId: number) {
        const problems = await ProblemRepository.getProblemsOfBundle(bundleId);
        await this.addProblems(problems.map((problem) => problem.id));
    }

    async removeProblems(problemId: number[]) {
        await Promise.all(
            problemId.map((id) =>
                StageRepository.removeProblem(this.stageId, id),
            ),
        );
    }
}
