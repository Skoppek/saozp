import { Elysia, t } from 'elysia';
import { problemRequests } from '../requests/problemRequests';
import { problemResponses } from '../responses/problemResponses';
import { ProblemService } from '../services/ProblemService';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { problemErrorHandler } from '../errorHandlers/problemErrorHandler';

// const submitTests = (
//     tests: { input: string; expected: string }[],
//     submissionId: number,
//     languageId: number,
//     code: string,
// ) => {
//     tests.forEach(async (test) => {
//         const token = (
//             await judge0Client.submit({
//                 languageId: languageId,
//                 code: code,
//                 test,
//             })
//         ).token;
//
//         await testRepository.createTest({
//             token,
//             submissionId,
//             ...test,
//         });
//     });
// };

export default new Elysia({
    prefix: '/problem',
    detail: {
        tags: ['Problems'],
    },
})
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
            body: 'createProblemRequest',
        },
    )
    .get('/', async ({ problemService }) => problemService.getProblemList(), {
        response: 'problemListResponse',
    })
    .group(
        '/:problemId',
        {
            params: t.Object({
                problemId: t.Number(),
            }),
        },
        (app) =>
            app
                .get(
                    '/',
                    async ({
                        problemService,
                        params: { problemId },
                        query: { solve },
                    }) => {
                        return await problemService.getProblemDetails(
                            problemId,
                            solve === 'true',
                        );
                    },
                    {
                        response: 'problemDetailsResponse',
                        query: t.Object({
                            solve: t.Optional(t.String()),
                        }),
                    },
                )
                .put(
                    '/',
                    async ({ problemService, params: { problemId }, body }) =>
                        await problemService.updateProblem(problemId, body),
                    {
                        body: 'updateProblemRequest',
                    },
                )
                .delete(
                    '/',
                    async ({ problemService, params: { problemId } }) =>
                        await problemService.deleteProblem(problemId),
                    {},
                ),
        // .post(
        //     '/submission',
        //     async ({ params: { problemId }, user, body, set }) => {
        //         if (!body.isCommit) {
        //             await submissionRepository.deleteNonCommitSubmissoins(
        //                 user.id,
        //                 problemId,
        //             );
        //         }
        //
        //         const newSubmission = (
        //             await submissionRepository.createSubmission({
        //                 problemId: problemId,
        //                 userId: user.id,
        //                 code: body.code,
        //                 isCommit: body.isCommit,
        //             })
        //         ).at(0);
        //
        //         if (!newSubmission || !newSubmission?.id) {
        //             set.status = 500;
        //             throw new Error('Submission not created.');
        //         }
        //
        //         const mergedCode = problem.baseCode.replace(
        //             /---(.*?)---/gs,
        //             newSubmission.code,
        //         );
        //
        //         submitTests(
        //             !!body.isCommit
        //                 ? problem.tests
        //                 : body.userTests ?? [],
        //             newSubmission.id,
        //             problem.languageId,
        //             mergedCode,
        //         );
        //
        //         return {
        //             submissionId: newSubmission.id,
        //         };
        //     },
        //     {
        //         body: t.Object({
        //             code: t.String(),
        //             userTests: t.Optional(
        //                 t.Array(
        //                     t.Object({
        //                         input: t.String(),
        //                         expected: t.String(),
        //                     }),
        //                 ),
        //             ),
        //             isCommit: t.Boolean(),
        //         }),
        //         response: t.Object({
        //             submissionId: t.Number(),
        //         }),
        //     },
        // );
    );
