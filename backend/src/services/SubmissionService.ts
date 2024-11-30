import judge0Client from '../judge/judge0Client';
import judge0Statuses from '../shared/judge0Statuses';
import {
    parseSubmissionListQuery,
    SubmissionListQuery,
} from '../queryParsers/submissionQueries';
import judge0Service from '../judge/judge0Client';
import {
    SubmissionCreationError,
    SubmissionNotFoundError,
} from '../errors/submissionErrors';
import { CreateSubmissionRequestBody } from '../bodies/submissionRequests';
import { ProblemNotFoundError } from '../errors/problemErrors';
import ProblemRepository from '../repository/ProblemRepository';
import { SubmissionRepository } from '../repository/SubmissionRepository';
import TestRepository from '../repository/TestRepository';
import { mapIfPresent } from '../shared/mapper';
import moment from 'moment';
import _ from 'lodash';
import StageRepository from '../repository/StageRepository';

export class SubmissionService {
    static async createSubmission(
        {
            problemId,
            stageId,
            code,
            createdAt,
            ip,
        }: CreateSubmissionRequestBody & { ip?: string },
        userId: number,
    ) {
        const problem = await ProblemRepository.getProblemById(problemId);

        if (!problem || problem.isDeactivated) {
            throw new ProblemNotFoundError(problemId);
        }

        await SubmissionService.checkForContest(stageId, createdAt);
        await SubmissionService.submit(
            problemId,
            userId,
            code,
            stageId,
            createdAt,
            problem,
            ip,
        );
        await SubmissionService.checkForContestDeletions(
            stageId,
            problemId,
            userId,
        );
    }

    private static async submit(
        problemId: number,
        userId: number,
        code: string,
        stageId: number | undefined,
        createdAt: Date | undefined,
        problem: {
            name: string;
            id: number;
            creatorId: number;
            prompt: string;
            languageId: number;
            tests: { input: string; expected: string }[];
            baseCode: string;
            isContestsOnly: boolean;
            isDeactivated: boolean;
        },
        ip?: string,
    ) {
        const newSubmission = await SubmissionRepository.createSubmission({
            problemId,
            userId,
            code,
            stageId,
            createdAt,
            ip,
        });

        if (!newSubmission) {
            throw new SubmissionCreationError();
        }

        const mergedCode = problem.baseCode.replace(
            /---(.*?)---/gs,
            newSubmission.code,
        );

        SubmissionService.submitTests(
            problem.tests,
            newSubmission.id,
            problem.languageId,
            mergedCode,
        );
        return newSubmission;
    }

    private static async checkForContestDeletions(
        stageId: number | undefined,
        problemId: number,
        userId: number,
    ) {
        if (stageId) {
            const contestSubmissions = await this.getSubmissionsList({
                stageId: stageId.toString(),
                problemId: problemId.toString(),
                commitsOnly: true.toString(),
                userId: userId.toString(),
            });

            await Promise.all(
                _.chain(contestSubmissions)
                    .sortBy('createdAt')
                    .dropRight(3)
                    .value()
                    .map((submission) => {
                        return SubmissionRepository.deleteSubmissionById(
                            submission.submissionId,
                        );
                    }),
            );
        }
    }

    private static async checkForContest(
        stageId: number | undefined,
        createdAt: Date | undefined,
    ) {
        if (stageId) {
            const stage = await StageRepository.getStageById(stageId);

            if (
                stage &&
                !moment(createdAt).isBetween(stage.startDate, stage.endDate)
            ) {
                throw new Error(
                    'Submissions to this contest are not accepted yet/anymore.',
                );
            }
        }
    }

    async rerunSubmissions(ids: number[]) {
        const originals = await Promise.all(
            ids.map((id) => SubmissionRepository.getSubmissionById(id)),
        );

        originals
            .filter((o) => o != undefined)
            .forEach(async (o) => {
                const problem = await ProblemRepository.getProblemById(
                    o.problemId,
                );

                if (!problem || problem.isDeactivated) {
                    throw new ProblemNotFoundError(o.problemId);
                }

                const newSubmission =
                    await SubmissionRepository.createSubmission({
                        problemId: o.problemId,
                        userId: o.userId,
                        code: o.code,
                        stageId: o.stageId,
                        createdAt: o.createdAt,
                        rerun: new Date(),
                    });

                if (!newSubmission) {
                    throw new SubmissionCreationError();
                }

                const mergedCode = problem.baseCode.replace(
                    /---(.*?)---/gs,
                    newSubmission.code,
                );

                SubmissionService.submitTests(
                    problem.tests,
                    newSubmission.id,
                    problem.languageId,
                    mergedCode,
                );
            });
    }

    static async getSubmissionsList(query: SubmissionListQuery) {
        const { userId, stageId, problemId, commitsOnly } =
            parseSubmissionListQuery(query);

        const submissions = await SubmissionRepository.getSubmissionsList(
            userId,
            problemId,
            commitsOnly,
            stageId,
        );

        return await Promise.all(
            submissions.map(async (submission) => {
                const tests = await TestRepository.getTestsOfSubmission(
                    submission.id,
                );
                const results = await judge0Client.getSubmissionBatch(
                    tests.map((test) => test.token),
                );

                return {
                    submissionId: submission.id,
                    creator: {
                        login: '',
                        userId: submission.creator?.userId ?? -1,
                        firstName: submission.creator?.firstName ?? '',
                        lastName: submission.creator?.lastName ?? '',
                    },
                    createdAt: submission.createdAt ?? undefined,
                    status: SubmissionService.reduceToStatus(
                        results.submissions.map((result) => result.status.id),
                    ),
                    isCommit: submission.isCommit,
                    rerun: mapIfPresent(submission.rerun, (o) => o),
                };
            }),
        );
    }

    static async getSubmissionDetails(submissionId: number) {
        const submission =
            await SubmissionRepository.getSubmissionById(submissionId);

        if (!submission) {
            throw new SubmissionNotFoundError(submissionId);
        }

        const problem = await ProblemRepository.getProblemById(
            submission.problemId,
        );

        if (!problem) {
            throw new ProblemNotFoundError(submission.problemId);
        }

        const tests = await TestRepository.getTestsOfSubmission(submission.id);

        const results = (
            await judge0Client.getSubmissionBatch(
                tests.map((test) => test.token),
            )
        ).submissions;

        const averageTime = SubmissionService.getAverage(
            results.map((result) => parseFloat(result.time)),
        );

        const averageMemory = SubmissionService.getAverage(
            results.map((result) => result.memory),
        );

        return {
            languageId:
                (await judge0Service.getLanguageById(problem.languageId))?.id ??
                0,
            code: submission.code,
            result: {
                tests: results.map((result) => {
                    return {
                        statusId: result.status.id,
                        token: result.token,
                        input: result.stdin,
                        expected: result.expected_output,
                        received: result.stdout,
                        error: result.stderr,
                    };
                }),
                averageMemory: isNaN(averageMemory) ? null : averageMemory,
                averageTime: isNaN(averageTime) ? null : averageTime,
            },
            createdAt: mapIfPresent(submission.createdAt, (v) => v),
            creator: mapIfPresent(submission.creator, (v) => v),
            ip: mapIfPresent(submission.ip, (v) => v),
        };
    }

    private static reduceToStatus(
        statusIds: number[],
    ): { id: number; description: string } | undefined {
        if (statusIds.includes(1)) {
            return judge0Statuses.inQueue;
        }
        if (statusIds.includes(2)) {
            return judge0Statuses.processing;
        }
        if (statusIds.some((status) => status == 5)) {
            return judge0Statuses.timeLimitExceeded;
        }
        if (statusIds.some((status) => status > 5)) {
            return judge0Statuses.error;
        }
        if (statusIds.every((status) => status == 3)) {
            return judge0Statuses.accepted;
        }
        return judge0Statuses.wrongAnswer;
    }

    private static getAverage(array: number[]) {
        return array.reduce((avg, element) => avg + element / array.length, 0);
    }

    private static submitTests(
        tests: { input: string; expected: string }[],
        submissionId: number,
        languageId: number,
        code: string,
    ) {
        tests.forEach(async (test) => {
            const token = (
                await judge0Client.submit({
                    languageId: languageId,
                    code: code,
                    test,
                })
            ).token;

            await TestRepository.createTest({
                token,
                submissionId,
                ...test,
            });
        });
    }
}
