import { Elysia, t } from 'elysia';
import submissionRepository from '../repository/submissionRepository';
import problemRepository from '../repository/problemRepository';
import judge0Client from '../judge/judge0Client';
import sessionRepository from '../repository/sessionRepository';
import testRepository from '../repository/testRepository';

const submitTests = (
    tests: { input: string; expected: string }[],
    submissionId: number,
    languageId: number,
    code: string,
) => {
    tests.forEach(async (test) => {
        const token = (
            await judge0Client.submit({
                languageId: languageId,
                code: code,
                test,
            })
        ).token;

        testRepository.createTest({
            token,
            submissionId,
            ...test,
        });
    });
};

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
                activeAfter: body.activeAfter,
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
                description: t.String(),
                prompt: t.String(),
                languageId: t.Number(),
                baseCode: t.String(),
                tests: t.Array(
                    t.Object({
                        input: t.String(),
                        expected: t.String(),
                    }),
                ),
                activeAfter: t.Date(),
            }),
        },
    )
    .get(
        '/',
        async () => {
            return (await problemRepository.getProblems())
                .filter((problem) => !problem.problems.isDeactivated)
                .map((problem) => {
                    return {
                        problemId: problem.problems.id,
                        name: problem.problems.name,
                        description: problem.problems.description,
                        languageId: problem.problems.languageId,
                        creator:
                            {
                                userId: problem.users?.id ?? -1,
                                login: problem.users?.login ?? '',
                                firstName: problem.profiles?.firstName ?? '',
                                lastName: problem.profiles?.lastName ?? '',
                            } ?? undefined,
                        activeAfter: problem.problems.activeAfter,
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
                    description: t.String(),
                    languageId: t.Number(),
                    creator: t.Optional(
                        t.Object({
                            userId: t.Number(),
                            login: t.String(),
                            firstName: t.String(),
                            lastName: t.String(),
                        }),
                    ),
                    activeAfter: t.Date(),
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
                    if (!problem || problem.isDeactivated) {
                        set.status = 404;
                        throw new Error('Problem not found!');
                    }
                    return { problem };
                })
                .get(
                    '/',
                    async ({ problem, query: { solve } }) => {
                        return {
                            problemId: problem.id,
                            name: problem.name,
                            description: problem.description,
                            prompt: problem.prompt,
                            languageId: problem.languageId,
                            baseCode:
                                // query params don't work with other types than string :(
                                solve === 'true'
                                    ? problem.baseCode
                                          .match(/---(.*?)---/gs)
                                          ?.at(0)
                                          ?.split('---')
                                          .join('') ?? problem.baseCode
                                    : problem.baseCode,
                            creatorId: problem.creator,
                            tests: problem.tests,
                            activeAfter: problem.activeAfter,
                        };
                    },
                    {
                        detail: {
                            tags: ['Problems'],
                        },
                        response: t.Object({
                            problemId: t.Number(),
                            name: t.String(),
                            description: t.String(),
                            prompt: t.String(),
                            languageId: t.Number(),
                            baseCode: t.String(),
                            creatorId: t.Number(),
                            tests: t.Array(
                                t.Object({
                                    input: t.String(),
                                    expected: t.String(),
                                }),
                            ),
                            activeAfter: t.Date(),
                        }),
                        query: t.Object({
                            solve: t.Optional(t.String()),
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
                                    activeAfter: body.activeAfter,
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
                            activeAfter: t.Date(),
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
                        if (!body.isCommit) {
                            await submissionRepository.deleteNonCommitSubmissoins(
                                userId,
                                problem.id,
                            );
                        }

                        const newSubmission = (
                            await submissionRepository.createSubmission({
                                problemId: problem.id,
                                userId,
                                code: body.code,
                                isCommit: body.isCommit,
                            })
                        ).at(0);

                        if (!newSubmission || !newSubmission?.id) {
                            set.status = 500;
                            throw new Error('Submission not created.');
                        }

                        const mergedCode = problem.baseCode.replace(
                            /---(.*?)---/gs,
                            newSubmission.code,
                        );

                        submitTests(
                            !!body.isCommit
                                ? problem.tests
                                : body.userTests ?? [],
                            newSubmission.id,
                            problem.languageId,
                            mergedCode,
                        );

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
                            userTests: t.Optional(
                                t.Array(
                                    t.Object({
                                        input: t.String(),
                                        expected: t.String(),
                                    }),
                                ),
                            ),
                            isCommit: t.Boolean(),
                        }),
                        response: t.Object({
                            submissionId: t.Number(),
                        }),
                    },
                );
        },
    );
