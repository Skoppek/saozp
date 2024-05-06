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
            const queryResult = await submissionRepository.getSubmissionsList(
                query.userId ? parseInt(query.userId) : undefined,
                query.problemId ? parseInt(query.problemId) : undefined,
            );

            return await Promise.all(
                queryResult.map(async (result) => {
                    const statusIds = (
                        await testRepository
                            .getTestsWithResultOfSubmission(
                                result.submissions.id,
                            )
                            .then(async (tests) => {
                                const firstTest = tests.at(0);
                                if (firstTest) {
                                    const judgeCheck =
                                        await judge0Client.getSubmission(
                                            firstTest.token,
                                        );

                                    if (
                                        judgeCheck &&
                                        judgeCheck.status.id > 5
                                    ) {
                                        return [
                                            {
                                                ...firstTest,
                                                statusId: judgeCheck.status.id,
                                            },
                                        ];
                                    }
                                }
                                return tests;
                            })
                    ).map((result) => result.statusId);

                    return {
                        submissionId: result.submissions.id,
                        creator: result.profiles,
                        createdAt:
                            result.submissions.createdAt?.toLocaleString(),
                        status: reduceToStatus(statusIds.map((id) => id ?? 0)),
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
                throw new Error('Internal error!');
            }

            let tests = await testRepository.getTestsWithResultOfSubmission(
                submission.id,
            );

            const firstTest = tests.at(0);
            if (firstTest) {
                const judgeCheck = await judge0Client.getSubmission(
                    firstTest.token,
                );

                if (judgeCheck && judgeCheck.status.id > 5) {
                    tests = [
                        {
                            ...firstTest,
                            statusId: judgeCheck.status.id,
                        },
                    ];
                    console.log(tests);
                }
            }

            return {
                languageId:
                    (await judge0Service.getLanguageById(problem.languageId))
                        ?.id ?? 0,
                code: submission.code,
                result: {
                    tests: tests.map((test) => {
                        return {
                            token: test.token,
                            input: test.input,
                            expected: test.expected,
                            received: test.received ?? '',
                        };
                    }),
                    averageMemory: getAverage(
                        tests.map((test) => test.memory ?? 0),
                    ),
                    averageTime: getAverage(
                        tests.map((test) => parseFloat(test.time ?? '0')),
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
                            token: t.String(),
                            input: t.String(),
                            expected: t.String(),
                            received: t.String(),
                        }),
                    ),
                    averageMemory: t.Number(),
                    averageTime: t.Number(),
                }),
            }),
        },
    );
