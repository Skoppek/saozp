import ContestRepository from '../repository/ContestRepository';
import { CreateContestBody } from '../bodies/contestBodies';
import {
    ContestCreationError,
    ContestNotFoundError,
} from '../errors/contestErrors';
import ProfileRepository from '../repository/ProfileRepository';
import ProblemRepository from '../repository/ProblemRepository';
import { Contest } from '../model/schemas/contestSchema';
import {
    ContestListQuery,
    parseContestListQuery,
} from '../queryParsers/contestQueries';

export default class ContestService {
    private contestRepository = new ContestRepository();
    private problemRepository = new ProblemRepository();

    async createContest(
        { name, endDate, startDate, description }: CreateContestBody,
        ownerId: number,
    ) {
        const newContest = await this.contestRepository.createContest({
            owner: ownerId,
            name,
            startDate,
            endDate,
            description,
        });

        if (!newContest) {
            throw new ContestCreationError();
        }
    }

    async getContestList(query: ContestListQuery) {
        const { participantId, ownerId } = parseContestListQuery(query);
        return this.contestRepository.getContests(participantId, ownerId);
    }

    async getContest(contestId: number) {
        const contest = await this.contestRepository.getContestById(contestId);

        if (!contest) {
            throw new ContestNotFoundError(contestId);
        }

        return contest;
    }

    async updateContest(contestId: number, data: Partial<Contest>) {
        await this.contestRepository.updateContest(contestId, data);
    }

    async deleteContest(contestId: number) {
        await this.contestRepository.deleteContest(contestId);
    }

    async getUsersOfContest(contestId: number) {
        return await ProfileRepository.getProfilesOfContest(contestId);
    }

    async getProblemsOfContest(contestId: number) {
        return await this.problemRepository.getProblemsOfContest(contestId);
    }

    async addUsersToContest(contestId: number, userIds: number[]) {
        await Promise.all(
            userIds.map((id) => this.contestRepository.addUser(contestId, id)),
        );
    }

    async addGroupToContest(contestId: number, groupId: number) {
        const users = await ProfileRepository.getProfilesOfGroup(groupId);

        await this.addUsersToContest(
            contestId,
            users.map((user) => user.userId),
        );
    }

    async removeUsersFromContest(contestId: number, userIds: number[]) {
        await Promise.all(
            userIds.map((id) =>
                this.contestRepository.removeUser(contestId, id),
            ),
        );
    }

    async addProblemsToContest(contestId: number, problemIds: number[]) {
        await Promise.all(
            problemIds.map((id) =>
                this.contestRepository.addProblem(contestId, id),
            ),
        );
    }

    async addBundleToContest(contestId: number, bundleId: number) {
        const problems =
            await this.problemRepository.getProblemsOfBundle(bundleId);

        await this.addProblemsToContest(
            contestId,
            problems.map((problem) => problem.id),
        );
    }

    async removeProblemsFromContest(contestId: number, problemIds: number[]) {
        await Promise.all(
            problemIds.map((id) =>
                this.contestRepository.removeProblem(contestId, id),
            ),
        );
    }
}
