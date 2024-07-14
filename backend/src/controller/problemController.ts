import { Elysia, t } from 'elysia';
import { problemRequests } from '../requests/problemRequests';
import { problemResponses } from '../responses/problemResponses';
import { ProblemService } from '../services/ProblemService';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { problemErrorHandler } from '../errorHandlers/problemErrorHandler';

export default new Elysia({
    prefix: 'problem',
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
        '',
        async ({ problemService, body, user }) => {
            await problemService.createProblem(body, user.id);
        },
        {
            body: 'createProblemRequest',
        },
    )
    .get('', async ({ problemService }) => problemService.getProblemList(), {
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
                    '',
                    async ({
                        problemService,
                        params: { problemId },
                        query: { solve },
                    }) =>
                        await problemService.getProblemDetails(
                            problemId,
                            solve === 'true',
                        ),
                    {
                        response: 'problemDetailsResponse',
                        query: t.Object({
                            solve: t.Optional(t.String()),
                        }),
                    },
                )
                .put(
                    '',
                    async ({ problemService, params: { problemId }, body }) =>
                        await problemService.updateProblem(problemId, body),
                    {
                        body: 'updateProblemRequest',
                    },
                )
                .delete(
                    '',
                    async ({ problemService, params: { problemId } }) =>
                        await problemService.deleteProblem(problemId),
                    {},
                ),
    );
