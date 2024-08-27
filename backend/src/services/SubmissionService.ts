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
import ContestRepository from '../repository/ContestRepository';
import moment from 'moment';
import _ from 'lodash';

export class SubmissionService {
    private problemRepository = new ProblemRepository();
    private submissionRepository = new SubmissionRepository();
    private testRepository = new TestRepository();
    private contestRepository = new ContestRepository();

    private reduceToStatus(
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

    private getAverage(array: number[]) {
        return array.reduce((avg, element) => avg + element / array.length, 0);
    }

    private submitTests(
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

            await this.testRepository.createTest({
                token,
                submissionId,
                ...test,
            });
        });
    }

    async createSubmission(
        {
            problemId,
            isCommit,
            contestId,
            code,
            userTests,
            createdAt,
        }: CreateSubmissionRequestBody,
        userId: number,
    ) {
        const problem = await this.problemRepository.getProblemById(problemId);

        if (!problem || problem.isDeactivated) {
            throw new ProblemNotFoundError(problemId);
        }

        if (contestId) {
            const contest =
                await this.contestRepository.getContestById(contestId);

            if (
                contest &&
                !moment(createdAt).isBetween(contest.startDate, contest.endDate)
            ) {
                throw new Error(
                    'Submissions to this contest are not accepted yet/anymore.',
                );
            }
        }

        if (!isCommit) {
            await this.submissionRepository.deleteNonCommitSubmissions(
                userId,
                problemId,
            );
        }

        const newSubmission = await this.submissionRepository.createSubmission({
            problemId,
            userId,
            code,
            isCommit,
            contestId,
            createdAt,
        });

        if (!newSubmission) {
            throw new SubmissionCreationError();
        }

        const mergedCode = problem.baseCode.replace(
            /---(.*?)---/gs,
            newSubmission.code,
        );

        this.submitTests(
            !!isCommit ? problem.tests : userTests ?? [],
            newSubmission.id,
            problem.languageId,
            mergedCode,
        );

        if (contestId) {
            const contestSubmissions = await this.getSubmissionsList({
                contestId: contestId.toString(),
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
                        console.log(submission.submissionId);
                        return this.submissionRepository.deleteSubmissionById(
                            submission.submissionId,
                        );
                    }),
            );
        }

        return {
            submissionId: newSubmission.id,
        };
    }

    async rerunSubmissions(ids: number[]) {
        const originals = await Promise.all(
            ids.map((id) => this.submissionRepository.getSubmissionById(id)),
        );

        originals
            .filter((o) => o != undefined)
            .forEach(async (o) => {
                const problem = await this.problemRepository.getProblemById(
                    o.problemId,
                );

                if (!problem || problem.isDeactivated) {
                    throw new ProblemNotFoundError(o.problemId);
                }

                const newSubmission =
                    await this.submissionRepository.createSubmission({
                        problemId: o.problemId,
                        userId: o.userId,
                        code: o.code,
                        isCommit: o.isCommit,
                        contestId: o.contestId,
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

                this.submitTests(
                    problem.tests,
                    newSubmission.id,
                    problem.languageId,
                    mergedCode,
                );
            });
    }

    async getSubmissionsList(query: SubmissionListQuery) {
        const { userId, problemId, contestId, commitsOnly } =
            parseSubmissionListQuery(query);

        const submissions = await this.submissionRepository.getSubmissionsList(
            userId,
            problemId,
            commitsOnly,
            contestId,
        );

        return await Promise.all(
            submissions.map(async (submission) => {
                const tests = await this.testRepository.getTestsOfSubmission(
                    submission.id,
                );
                const results = (
                    await judge0Client.getSubmissionBatch(
                        tests.map((test) => test.token),
                    )
                ).submissions;

                return {
                    submissionId: submission.id,
                    creator: {
                        login: '',
                        userId: submission.creator?.userId ?? -1,
                        firstName: submission.creator?.firstName ?? '',
                        lastName: submission.creator?.lastName ?? '',
                    },
                    createdAt: submission.createdAt ?? undefined,
                    status: this.reduceToStatus(
                        results.map((result) => result.status.id),
                    ),
                    isCommit: submission.isCommit,
                    rerun: mapIfPresent(submission.rerun, (o) => o),
                };
            }),
        );
    }

    async getSubmissionDetails(submissionId: number) {
        const submission =
            await this.submissionRepository.getSubmissionById(submissionId);

        if (!submission) {
            throw new SubmissionNotFoundError(submissionId);
        }

        const problem = await this.problemRepository.getProblemById(
            submission.problemId,
        );

        if (!problem) {
            throw new ProblemNotFoundError(submission.problemId);
        }

        const tests = await this.testRepository.getTestsOfSubmission(
            submission.id,
        );

        const results = (
            await judge0Client.getSubmissionBatch(
                tests.map((test) => test.token),
            )
        ).submissions;

        const averageTime = this.getAverage(
            results.map((result) => parseFloat(result.time)),
        );

        const averageMemory = this.getAverage(
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
                    };
                }),
                averageMemory: isNaN(averageMemory) ? null : averageMemory,
                averageTime: isNaN(averageTime) ? null : averageTime,
            },
            createdAt: mapIfPresent(submission.createdAt, (v) => v),
            creator: mapIfPresent(submission.creator, (v) => v),
        };
    }
}
