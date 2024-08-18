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
import moment from 'moment';
import { SubmissionRepository } from '../repository/SubmissionRepository';
import _ from 'lodash';
import { SubmissionService } from './SubmissionService';

export default class ContestService {
    private contestRepository = new ContestRepository();
    private problemRepository = new ProblemRepository();
    private submissionRepository = new SubmissionRepository();

    private submissionService = new SubmissionService();

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

    async rerunLatestSubmissions(contestId: number) {
        const allSubmissions =
            await this.submissionRepository.getSubmissionsList(
                undefined,
                undefined,
                true,
                contestId,
            );

        const idsToRerun = _.chain(allSubmissions)
            .groupBy('problemId')
            .map((o) =>
                _.chain(o)
                    .groupBy('creator.userId')
                    .map((o) => _.chain(o).sortBy('createdAt').last().value())
                    .flatMap()
                    .value(),
            )
            .flatMap()
            .map((o) => o.id)
            .value();

        this.submissionService.rerunSubmissions(idsToRerun);
    }

    async getUsersOfContest(contestId: number) {
        return await ProfileRepository.getProfilesOfContest(contestId);
    }

    async getProblemsOfContest(contestId: number, userId: number) {
        const contest = await this.contestRepository.getContestById(contestId);

        if (
            userId != contest?.owner.userId &&
            moment().isBefore(contest?.startDate)
        )
            throw new Error('This contest has not started yet.');

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
