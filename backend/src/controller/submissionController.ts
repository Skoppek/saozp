import { Elysia, t } from 'elysia';
import problemRepository from '../repository/problemRepository';
import judge0Service from '../judge/judge0Client';
import testRepository from '../repository/testRepository';
import judge0Client from '../judge/judge0Client';
import { sessionCookie } from '../plugins/sessionCookie';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { SubmissionService } from '../services/SubmissionService';
import { submissionResponses } from '../responses/submissionResponses';
import { withSubmission } from '../plugins/withSubmission';
import { parseSubmissionListQuery } from '../queryParsers/submissionQueries';

const getAverage = (array: number[]) => {
    return array.reduce((avg, element) => avg + element / array.length, 0);
};

export default new Elysia({ prefix: '/submissions' })
    .use(sessionCookie)
    .use(authenticatedUser)
    .use(submissionResponses)
    .decorate({
        submissionService: new SubmissionService(),
    })
    .get(
        '/',
        async ({ submissionService, query }) =>
            await submissionService.getSubmissionsList(
                parseSubmissionListQuery(query),
            ),
        {
            detail: {
                tags: ['Submissions'],
            },
            query: t.Object({
                userId: t.Optional(t.String()),
                problemId: t.Optional(t.String()),
                commitsOnly: t.Optional(t.String()),
            }),
            response: 'getSubmissionListResponse',
        },
    )
    .use(withSubmission)
    .get(
        '/:submissionId',
        async ({ submission, set }) => {
            const problem = await problemRepository.getProblemById(
                submission.problemId,
            );

            if (!problem) {
                set.status = 500;
                throw new Error('Internal error! Problem was not found.');
            }

            const tests = await testRepository.getTestsOfSubmission(
                submission.id,
            );

            const results = (
                await judge0Client.getSubmissionBatch(
                    tests.map((test) => test.token),
                )
            ).submissions;

            return {
                languageId:
                    (await judge0Service.getLanguageById(problem.languageId))
                        ?.id ?? 0,
                code: submission.code,
                result: {
                    tests: results.map((result) => {
                        return {
                            statusId: result.status.id,
                            token: result.token,
                            input: result.stdin,
                            expected: result.expected_output,
                            received: result.stdout,
                        };
                    }),
                    averageMemory: getAverage(
                        results.map((result) => result.memory),
                    ),
                    averageTime: getAverage(
                        results.map((result) => parseFloat(result.time)),
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
            response: 'getSubmissionDetailsResponse',
        },
    );
