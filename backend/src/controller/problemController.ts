import { Elysia, t } from 'elysia';
import { server } from '..';
import submissionRepository from '../repository/submissionRepository';
import problemRepository from '../repository/problemRepository';
import judge0Client from '../judge/judge0Client';
import sessionRepository from '../repository/sessionRepository';
import testRepository from '../repository/testRepository';

export default new Elysia({ prefix: '/problem' })
    .derive(async ({ cookie: { session }, set }) => {
        if (!session || !session.value) {
            set.status = 401;
            throw new Error('Session cookie not found');
        }
        const sessionData = await sessionRepository.getSessionById(
            session.value,
        );
        if (!sessionData) {
            set.status = 401;
            throw new Error(session.value);
        }
        if (sessionData.expiresAt < new Date()) {
            set.status = 401;
            throw new Error('Session expired');
        }
        if (!sessionData.userId) {
            set.status = 500;
            throw new Error('User not found for session!');
        }
        return {
            userId: sessionData.userId,
        };
    })
    .post(
        '/',
        ({ body, userId, set }) => {
            const newProblem = problemRepository.createProblem({
                name: body.name,
                description: body.description,
                creator: userId,
                prompt: body.prompt,
                languageId: body.languageId,
                tests: body.tests,
                baseCode: body.baseCode,
            });
            if (!newProblem) {
                set.status = 500;
                throw new Error('Problem creation failure');
            }
        },
        {
            detail: {
                tags: ['Problems'],
            },
            body: t.Object({
                name: t.String(),
                description: t.Optional(t.String()),
                prompt: t.String(),
                languageId: t.Number(),
                baseCode: t.String(),
                tests: t.Array(
                    t.Object({
                        input: t.String(),
                        expected: t.String(),
                    }),
                ),
            }),
        },
    )
    .get(
        '/',
        async () => {
            return (await problemRepository.getProblems()).map((problem) => {
                return {
                    problemId: problem.problems.id,
                    name: problem.problems.name,
                    description: problem.problems.description ?? undefined,
                    languageId: problem.problems.languageId,
                    creator: problem.profiles ?? undefined,
                };
            });
        },
        {
            detail: {
                tags: ['Problems'],
            },
            response: t.Array(
                t.Object({
                    problemId: t.Number(),
                    name: t.String(),
                    description: t.Optional(t.String()),
                    languageId: t.Number(),
                    creator: t.Optional(
                        t.Object({
                            userId: t.Number(),
                            firstName: t.String(),
                            lastName: t.String(),
                        }),
                    ),
                }),
            ),
        },
    )
    .group(
        '/:problemId',
        {
            params: t.Object({
                problemId: t.String(),
            }),
        },
        (app) => {
            return app
                .derive(async ({ params: { problemId }, set }) => {
                    const problem =
                        await problemRepository.getProblemById(+problemId);
                    if (!problem) {
                        set.status = 404;
                        throw new Error('Problem not found!');
                    }
                    return { problem };
                })
                .get(
                    '/',
                    async ({ problem }) => {
                        return {
                            problemId: problem.id,
                            name: problem.name,
                            description: problem.description,
                            prompt: problem.prompt,
                            languageId: problem.languageId,
                            baseCode: problem.baseCode,
                            creatorId: problem.creator,
                        };
                    },
                    {
                        detail: {
                            tags: ['Problems'],
                        },
                        response: t.Object({
                            problemId: t.Number(),
                            name: t.String(),
                            description: t.Nullable(t.String()),
                            prompt: t.String(),
                            languageId: t.Number(),
                            baseCode: t.String(),
                            creatorId: t.Number(),
                        }),
                    },
                )
                .put(
                    '/',
                    async ({ problem, body, set }) => {
                        const updatedProblem =
                            await problemRepository.updateProblemById(
                                problem.id,
                                {
                                    name: body.name,
                                    prompt: body.prompt,
                                    languageId: body.languageId,
                                    baseCode: body.baseCode,
                                    tests: body.tests,
                                },
                            );
                        if (!updatedProblem) {
                            set.status = 404;
                            throw new Error('Resource not found');
                        }
                    },
                    {
                        detail: {
                            tags: ['Problems'],
                        },
                        body: t.Object({
                            name: t.Optional(t.String()),
                            description: t.Optional(t.String()),
                            prompt: t.Optional(t.String()),
                            languageId: t.Optional(t.Number()),
                            baseCode: t.Optional(t.String()),
                            tests: t.Optional(
                                t.Array(
                                    t.Object({
                                        input: t.String(),
                                        expected: t.String(),
                                    }),
                                ),
                            ),
                        }),
                    },
                )
                .delete(
                    '/',
                    async ({ problem }) => {
                        problemRepository.deleteProblemById(problem.id);
                    },
                    {
                        detail: {
                            tags: ['Problems'],
                        },
                    },
                )
                .post(
                    '/submission',
                    async ({ problem, userId, body, set }) => {
                        const newSubmission = (
                            await submissionRepository.createSubmission({
                                problemId: problem.id,
                                userId,
                                code: body.code,
                            })
                        ).at(0);

                        if (!newSubmission || !newSubmission?.id) {
                            set.status = 500;
                            throw new Error('Submission not created.');
                        }

                        const tests = problem.tests.concat(body.userTests);

                        tests.forEach(async (test) => {
                            const token = (
                                await judge0Client.submit({
                                    languageId: problem.languageId,
                                    code: body.code,
                                    test,
                                    callbackUrl: `http://172.17.0.1:${server?.port}/judge0/callback`,
                                })
                            ).token;

                            testRepository.createTest({
                                token,
                                submissionId: newSubmission.id,
                                ...test,
                            });
                        });

                        return {
                            submissionId: newSubmission.id,
                        };
                    },
                    {
                        detail: {
                            tags: ['Problems'],
                        },
                        body: t.Object({
                            code: t.String(),
                            userTests: t.Array(
                                t.Object({
                                    input: t.String(),
                                    expected: t.String(),
                                }),
                            ),
                        }),
                        response: t.Object({
                            submissionId: t.Number(),
                        }),
                    },
                );
        },
    );
