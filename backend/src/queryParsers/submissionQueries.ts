import { Static, t } from 'elysia';

const submissionListQuery = t.Object({
    userId: t.Optional(t.String()),
    problemId: t.Optional(t.String()),
    commitsOnly: t.Optional(t.String()),
});

type SubmissionListQuery = Static<typeof submissionListQuery>;

export const parseSubmissionListQuery = (query: SubmissionListQuery) => {
    return {
        userId: query.userId ? parseInt(query.userId) : undefined,
        problemId: query.problemId ? parseInt(query.problemId) : undefined,
        commitsOnly: query.commitsOnly
            ? query.commitsOnly == 'true'
            : undefined,
    };
};
