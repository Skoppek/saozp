import ContestRepository from '../repository/ContestRepository';
import { CreateContestBody } from '../bodies/contestBodies';
import {
    ContestCreationError,
    ContestNotFoundError,
} from '../errors/contestErrors';
import ProfileRepository from '../repository/ProfileRepository';
import { Contest } from '../model/schemas/contestSchema';
import {
    ContestListQuery,
    parseContestListQuery,
} from '../queryParsers/contestQueries';
import { SubmissionRepository } from '../repository/SubmissionRepository';
import _ from 'lodash';
import { SubmissionService } from './SubmissionService';
import StageRepository from '../repository/StageRepository';

export default class ContestService {
    private submissionRepository = new SubmissionRepository();

    private submissionService = new SubmissionService();

    private contestId: number;

    constructor(constestId: number) {
        this.contestId = constestId;
    }

    getContestId() {
        return this.contestId;
    }

    static async create(
        { name, description }: CreateContestBody,
        ownerId: number,
    ) {
        const newContest = await ContestRepository.createContest({
            owner: ownerId,
            name,
            description,
        });

        if (!newContest) {
            throw new ContestCreationError();
        }
    }

    static async getMany(query: ContestListQuery) {
        const { participantId, ownerId } = parseContestListQuery(query);
        return ContestRepository.getContests(participantId, ownerId);
    }

    async getDetails() {
        const contest = await ContestRepository.getContestById(this.contestId);

        if (!contest) {
            throw new ContestNotFoundError(this.contestId);
        }

        const stages = await StageRepository.getStagesOfContest(contest.id);

        return { ...contest, stages: stages.map((stage) => stage.id) };
    }

    async update(data: Partial<Contest>) {
        await ContestRepository.updateContest(this.contestId, data);
    }

    async delete() {
        await ContestRepository.deleteContest(this.contestId);
    }

    async rerunLatestSubmissions() {
        const allSubmissions =
            await this.submissionRepository.getSubmissionsList(
                undefined,
                undefined,
                true,
                this.contestId,
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

    async getParticipants() {
        return await ProfileRepository.getProfilesOfContest(this.contestId);
    }

    async addParticipants(userIds: number[]) {
        await Promise.all(
            userIds.map((id) => ContestRepository.addUser(this.contestId, id)),
        );
    }

    async addGroup(groupId: number) {
        const users = await ProfileRepository.getProfilesOfGroup(groupId);
        await this.addParticipants(users.map((user) => user.userId));
    }

    async removeParticipants(userIds: number[]) {
        await Promise.all(
            userIds.map((id) =>
                ContestRepository.removeUser(this.contestId, id),
            ),
        );
    }
}
