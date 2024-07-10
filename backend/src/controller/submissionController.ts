import { Elysia, t } from 'elysia';
import { sessionCookie } from '../plugins/sessionCookie';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { SubmissionService } from '../services/SubmissionService';
import { submissionResponses } from '../responses/submissionResponses';
import { submissionQuery } from '../queryParsers/submissionQueries';
import { submissionErrorHandler } from '../errorHandlers/submissionErrorHandler';
import submissionRepository from '../repository/submissionRepository';
import problemRepository from '../repository/problemRepository';
import judge0Client from '../judge/judge0Client';
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

        await testRepository.createTest({
            token,
            submissionId,
            ...test,
        });
    });
};

export default new Elysia({
    prefix: '/submission',
    detail: {
        tags: ['Submissions'],
    },
})
    .use(sessionCookie)
    .use(authenticatedUser)
    .use(submissionErrorHandler)
    .use(submissionResponses)
    .use(submissionQuery)
    .decorate({
        submissionService: new SubmissionService(),
    })
    .post(
        '/submission',
        async ({
            user,
            body: { problemId, isCommit, code, userTests },
            set,
        }) => {
            const problem = await problemRepository.getProblemById(problemId);

            if (!problem) {
                // set.status = 500;
                throw new Error('Internal error! Problem was not found.');
            }

            if (!isCommit) {
                await submissionRepository.deleteNonCommitSubmissoins(
                    user.id,
                    problemId,
                );
            }

            const newSubmission = (
                await submissionRepository.createSubmission({
                    problemId: problemId,
                    userId: user.id,
                    code: code,
                    isCommit: isCommit,
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
                !!isCommit ? problem.tests : userTests ?? [],
                newSubmission.id,
                problem.languageId,
                mergedCode,
            );

            return {
                submissionId: newSubmission.id,
            };
        },
        {
            body: t.Object({
                problemId: t.Number(),
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
    )
    .get(
        '/',
        async ({ submissionService, query }) =>
            await submissionService.getSubmissionsList(query),
        {
            query: 'submissionListQuery',
            response: 'getSubmissionListResponse',
        },
    )
    .get(
        '/:submissionId',
        async ({ submissionService, params: { submissionId } }) => {
            return await submissionService.getSubmissionDetails(submissionId);
        },
        {
            params: t.Object({
                submissionId: t.Number(),
            }),
            response: 'getSubmissionDetailsResponse',
        },
    );
