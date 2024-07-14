import { Elysia, t } from 'elysia';
import { sessionCookie } from '../plugins/sessionCookie';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { SubmissionService } from '../services/SubmissionService';
import { submissionResponses } from '../responses/submissionResponses';
import { submissionQueries } from '../queryParsers/submissionQueries';
import { submissionErrorHandler } from '../errorHandlers/submissionErrorHandler';
import { submissionRequestBodies } from '../bodies/submissionRequests';

export default new Elysia({
    prefix: 'submission',
    detail: {
        tags: ['Submissions'],
    },
})
    .use(sessionCookie)
    .use(authenticatedUser)
    .use(submissionErrorHandler)
    .use(submissionRequestBodies)
    .use(submissionResponses)
    .use(submissionQueries)
    .decorate({
        submissionService: new SubmissionService(),
    })
    .post(
        '',
        async ({ submissionService, userId, body }) =>
            await submissionService.createSubmission(body, userId),
        {
            body: 'createSubmissionRequestBody',
        },
    )
    .get(
        '',
        async ({ submissionService, query }) =>
            await submissionService.getSubmissionsList(query),
        {
            query: 'submissionListQuery',
            response: 'getSubmissionListResponse',
        },
    )
    .get(
        ':submissionId',
        async ({ submissionService, params: { submissionId } }) =>
            await submissionService.getSubmissionDetails(submissionId),
        {
            params: t.Object({
                submissionId: t.Number(),
            }),
            response: 'getSubmissionDetailsResponse',
        },
    );
