import { Elysia, t } from 'elysia';
import { sessionCookie } from '../plugins/sessionCookie';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { SubmissionService } from '../services/SubmissionService';
import { submissionResponses } from '../responses/submissionResponses';
import { submissionQuery } from '../queryParsers/submissionQueries';
import { submissionErrorHandler } from '../errorHandlers/submissionErrorHandler';

export default new Elysia({
    prefix: '/submissions',
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
