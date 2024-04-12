import { Elysia, t } from 'elysia';
import submissionRepository from '../repository/submissionRepository';
import judge0Statuses from '../shared/judge0Statuses';
import problemRepository from '../repository/problemRepository';
import judge0Service from '../judge/judge0Client';
import testRepository from '../repository/testRepository';
import sessionRepository from '../repository/sessionRepository';

const NO_LANGUAGE_NAME = 'Unknown language';

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
                query.userId,
                query.problemId,
            );

            return await Promise.all(
                queryResult.map(async (submission) => {
                    const statusIds = (
                        await testRepository.getTestsWithResultOfSubmission(
                            submission.id,
                        )
                    ).map((result) => result.statusId);

                    return {
                        submissionId: submission.id,
                        creator: submission.creator,
                        createdAt: submission.createdAt,
                        status: reduceToStatus(statusIds),
                    };
                }),
            );
        },
        {
            detail: {
                tags: ['Submissions'],
            },
            query: t.Object({
                userId: t.Optional(t.Number()),
                problemId: t.Optional(t.Number()),
            }),
            response: t.Array(
                t.Object({
                    submissionId: t.Number(),
                    creator: t.String(),
                    createdAt: t.Nullable(t.Date()),
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

            const tests = await testRepository.getTestsWithResultOfSubmission(
                submission.id,
            );

            return {
                language:
                    (await judge0Service.getLanguageById(problem.languageId))
                        ?.name ?? NO_LANGUAGE_NAME,
                code: submission.code,
                result: {
                    tests,
                    averageMemory: getAverage(tests.map((test) => test.memory)),
                    averageTime: getAverage(
                        tests.map((test) => parseFloat(test.time)),
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
                language: t.String(),
                code: t.String(),
                result: t.Object({
                    tests: t.Array(
                        t.Object({
                            input: t.String(),
                            expected: t.String(),
                            recieved: t.String(),
                        }),
                    ),
                    averageMemory: t.Number(),
                    averageTime: t.Number(),
                }),
            }),
        },
    );
