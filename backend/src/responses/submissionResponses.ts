import { Elysia, t } from 'elysia';

const getSubmissionListResponse = t.Array(
    t.Object({
        submissionId: t.Number(),
        creator: t.Nullable(
            t.Object({
                firstName: t.String(),
                login: t.String(),
                lastName: t.String(),
                userId: t.Number(),
            }),
        ),
        createdAt: t.Optional(t.String()),
        status: t.Optional(
            t.Object({
                id: t.Number(),
                description: t.String(),
            }),
        ),
        isCommit: t.Boolean(),
        contestId: t.Optional(t.Number()),
    }),
);

const getSubmissionDetailsResponse = t.Object({
    languageId: t.Number(),
    code: t.String(),
    result: t.Object({
        tests: t.Array(
            t.Object({
                statusId: t.Number(),
                token: t.String(),
                input: t.String(),
                expected: t.String(),
                received: t.Nullable(t.String()),
            }),
        ),
        averageMemory: t.Number(),
        averageTime: t.Number(),
    }),
    contestId: t.Optional(t.Number()),
});

export const submissionResponses = new Elysia().model({
    getSubmissionListResponse,
    getSubmissionDetailsResponse,
});
