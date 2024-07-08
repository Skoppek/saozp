import { Elysia, t } from 'elysia';
import submissionRepository from '../repository/submissionRepository';
import judge0Client from '../judge/judge0Client';
import testRepository from '../repository/testRepository';
import { problemRequests } from '../requests/problemRequests';
import { problemResponses } from '../responses/problemResponses';
import { withProblem } from '../plugins/withProblem';
import { ProblemService } from '../services/ProblemService';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { problemErrorHandler } from '../errorHandlers/problemErrorHandler';

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

        await testRepository.createTest({
            token,
            submissionId,
            ...test,
        });
    });
};

export default new Elysia({ prefix: '/problem' })
    .use(authenticatedUser)
    .use(problemRequests)
    .use(problemResponses)
    .use(problemErrorHandler)
    .decorate({
        problemService: new ProblemService(),
    })
    .post(
        '/',
        async ({ problemService, body, user }) => {
            await problemService.createProblem(body, user.id);
        },
        {
            detail: {
                tags: ['Problems'],
            },
            body: 'createProblemRequest',
        },
    )
    .get('/', async ({ problemService }) => problemService.getProblemList(), {
        detail: {
            tags: ['Problems'],
        },
        response: 'problemListResponse',
    })
    .group(
        '/:problemId',
        {
            params: t.Object({
                problemId: t.String(),
            }),
        },
        (app) => {
            return app
                .use(withProblem)
                .get(
                    '/',
                    async ({ problemService, problem, query: { solve } }) =>
                        problemService.getProblemDetails(
                            problem,
                            solve === 'true',
                        ),
                    {
                        detail: {
                            tags: ['Problems'],
                        },
                        response: 'problemDetailsResponse',
                        query: t.Object({
                            solve: t.Optional(t.String()),
                        }),
                    },
                )
                .put(
                    '/',
                    async ({ problemService, problem, body }) =>
                        await problemService.updateProblem(problem.id, body),
                    {
                        detail: {
                            tags: ['Problems'],
                        },
                        body: 'updateProblemRequest',
                    },
                )
                .delete(
                    '/',
                    async ({ problemService, problem }) =>
                        await problemService.deleteProblem(problem.id),
                    {
                        detail: {
                            tags: ['Problems'],
                        },
                    },
                )
                .post(
                    '/submission',
                    async ({ problem, user, body, set }) => {
                        if (!body.isCommit) {
                            await submissionRepository.deleteNonCommitSubmissoins(
                                user.id,
                                problem.id,
                            );
                        }

                        const newSubmission = (
                            await submissionRepository.createSubmission({
                                problemId: problem.id,
                                userId: user.id,
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
