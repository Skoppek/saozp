import { Elysia, Static, t } from 'elysia';

const createSubmissionRequestBody = t.Object({
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
    stageId: t.Optional(t.Number()),
    createdAt: t.Optional(t.Date()),
});

export type CreateSubmissionRequestBody = Static<
    typeof createSubmissionRequestBody
>;

export const submissionRequestBodies = new Elysia().model({
    createSubmissionRequestBody,
});
