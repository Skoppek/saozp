import { Elysia, t } from 'elysia';
import submissionRepository from '../repository/submissionRepository';
import judge0Statuses from '../shared/judge0Statuses';
import problemRepository from '../repository/problemRepository';
import judge0Service from '../judge/judge0Client';
import testRepository from '../repository/testRepository';
import sessionRepository from '../repository/sessionRepository';
import judge0Client from '../judge/judge0Client';

const reduceToStatus = (
    statusIds: number[],
): { id: number; description: string } | undefined => {
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
};

const getAverage = (array: number[]) => {
    return array.reduce((avg, element) => avg + element / array.length, 0);
};

export default new Elysia({ prefix: '/submissions' })
    .onBeforeHandle(async ({ cookie: { session }, set }) => {
        if (!session || !session.value) {
            set.status = 401;
            throw new Error('Session cookie not found');
        }
        const sessionData = await sessionRepository.getSessionById(
            session.value,
        );
        if (!sessionData) {
            set.status = 401;
            throw new Error('Session not found');
        }
        if (sessionData.expiresAt < new Date()) {
            set.status = 401;
            throw new Error('Session expired');
        }
    })
    .get(
        '/',
        async ({ query }) => {
            const submissions = await submissionRepository.getSubmissionsList(
                query.userId ? parseInt(query.userId) : undefined,
                query.problemId ? parseInt(query.problemId) : undefined,
            );

            return await Promise.all(
                submissions.map(async (submission) => {
                    const tests = await testRepository.getTestsOfSubmission(
                        submission.id,
                    );
                    const results = (
                        await judge0Client.getSubmissionBatch(
                            tests.map((test) => test.token),
                        )
                    ).submissions;

                    return {
                        submissionId: submission.id,
                        creator: submission.creator,
                        createdAt: submission.createdAt?.toLocaleString(),
                        status: reduceToStatus(
                            results.map((result) => result.status.id),
                        ),
                        isCommit: submission.isCommit,
                    };
                }),
            );
        },
        {
            detail: {
                tags: ['Submissions'],
            },
            query: t.Object({
                userId: t.Optional(t.String()),
                problemId: t.Optional(t.String()),
            }),
            response: t.Array(
                t.Object({
                    submissionId: t.Number(),
                    creator: t.Nullable(
                        t.Object({
                            firstName: t.String(),
                            lastName: t.String(),
                            userId: t.Number(),
                        }),
                    ),
                    createdAt: t.Optional(t.String()),
                    status: t.Optional(
                        t.Object({
                            id: t.Number(),
                            description: t.String(),
                        }),
                    ),
                    isCommit: t.Boolean(),
                }),
            ),
        },
    )
    .get(
        '/:submissionId',
        async ({ params, set }) => {
            const submission = await submissionRepository.getSubmissionById(
                parseInt(params.submissionId),
            );

            if (!submission) {
                set.status = 404;
                throw new Error('Submission not found!');
            }

            const problem = await problemRepository.getProblemById(
                submission.problemId,
            );

            if (!problem) {
                set.status = 500;
                throw new Error('Internal error! Problem was not found.');
            }

            const tests = await testRepository.getTestsOfSubmission(
                submission.id,
            );

            const results = (
                await judge0Client.getSubmissionBatch(
                    tests.map((test) => test.token),
                )
            ).submissions;

            return {
                languageId:
                    (await judge0Service.getLanguageById(problem.languageId))
                        ?.id ?? 0,
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
                    averageMemory: getAverage(
                        results.map((result) => result.memory),
                    ),
                    averageTime: getAverage(
                        results.map((result) => parseFloat(result.time)),
                    ),
                },
            };
        },
        {
            detail: {
                tags: ['Submissions'],
            },
            params: t.Object({
                submissionId: t.String(),
            }),
            response: t.Object({
                languageId: t.Number(),
                code: t.String(),
                result: t.Object({
                    tests: t.Array(
                        t.Object({
                            statusId: t.Number(),
                            token: t.String(),
                            input: t.String(),
                            expected: t.String(),
                            received: t.Nullable(t.String()),
                        }),
                    ),
                    averageMemory: t.Number(),
                    averageTime: t.Number(),
                }),
            }),
        },
    );
