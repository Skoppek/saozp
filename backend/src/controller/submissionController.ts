import { Elysia, t } from 'elysia';
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
        async ({ userId, body }) =>
            await SubmissionService.createSubmission(body, userId),
        {
            body: 'createSubmissionRequestBody',
        },
    )
    .get(
        '',
        async ({ query }) => await SubmissionService.getSubmissionsList(query),
        {
            query: 'submissionListQuery',
            response: 'getSubmissionListResponse',
        },
    )
    .get(
        '/:submissionId',
        async ({ params: { submissionId } }) =>
            await SubmissionService.getSubmissionDetails(submissionId),
        {
            params: t.Object({
                submissionId: t.Number(),
            }),
            response: 'getSubmissionDetailsResponse',
        },
    );
