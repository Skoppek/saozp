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
import judge0Client from '../judge/judge0Client';
import TestRepository from '../repository/TestRepository';
import judge0Statuses from '../shared/judge0Statuses';
import ProblemRepository from '../repository/ProblemRepository';

export default class ContestService {
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

        return contest;
    }

    async getStages() {
        const phases = await StageRepository.getStagesOfContest(this.contestId);

        return phases.map((phase) => {
            return {
                id: phase.id,
                name: phase.name,
                startDate: phase.startDate,
                endDate: phase.endDate,
            };
        });
    }

    async update(data: Partial<Contest>) {
        await ContestRepository.updateContest(this.contestId, data);
    }

    async delete() {
        await ContestRepository.deleteContest(this.contestId);
    }

    async rerunLatestSubmissions() {
        const allSubmissions = await SubmissionRepository.getSubmissionsList(
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

    async getStagesStats() {
        const stages = await StageRepository.getStagesOfContest(this.contestId);
        const participants = await this.getParticipants();

        return await Promise.all(
            stages.map(async (stage) => {
                const participantsResults = await Promise.all(
                    participants.map(async (participant) => {
                        return {
                            participantId: participant.userId,
                            result: await ContestService.getResultOfParticipantInStage(
                                participant.userId,
                                stage.id,
                            ),
                        };
                    }),
                );

                return {
                    stage: {
                        id: stage.id,
                        name: stage.name,
                        startDate: stage.startDate,
                        endDate: stage.endDate,
                    },
                    results: participantsResults,
                };
            }),
        );
    }

    private static async getResultOfParticipantInStage(
        participant: number,
        stage: number,
    ) {
        const submissions = await SubmissionRepository.getSubmissionsList(
            participant,
            undefined,
            true,
            stage,
        );

        const x = _(submissions)
            .sortBy('createdAt')
            .groupBy('problemId')
            .map((group) => _.last(group) ?? [])
            .flatMap()
            .value();

        const results = await Promise.all(
            x.map(async (submission) => {
                return await ContestService.getResultOfSubmission(
                    submission.id,
                );
            }),
        );

        const mean = _.mean(results);

        return _.isNaN(mean) ? -1 : mean;
    }

    private static async getResultOfSubmission(submission: number) {
        const tests = await TestRepository.getTestsOfSubmission(submission);
        const results = (
            await judge0Client.getSubmissionBatch(
                tests.map((test) => test.token),
            )
        ).submissions;

        const correctCount = results.filter(
            (result) => result.status.id == judge0Statuses.accepted.id,
        ).length;

        return _.floor(
            (correctCount / (!!results.length ? results.length : 1)) * 100,
        );
    }

    async getStatsForStage(stageId: number, participantId: number) {
        const problems = await ProblemRepository.getProblemsOfStage(stageId);

        return await Promise.all(
            problems.map(async (problem) => {
                const submissions =
                    await SubmissionRepository.getSubmissionsList(
                        participantId,
                        problem.problemId,
                        true,
                        stageId,
                    );

                const lastSubmission = _(submissions)
                    .sortBy('createdAt')
                    .groupBy('problemId')
                    .map((group) => _.last(group) ?? [])
                    .flatMap()
                    .value()[0];

                return {
                    problem: problem,
                    submissionId: lastSubmission?.id,
                    result: lastSubmission
                        ? await ContestService.getResultOfSubmission(
                              lastSubmission.id,
                          )
                        : -1,
                };
            }),
        );
    }
}
